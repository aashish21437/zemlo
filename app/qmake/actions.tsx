"use server";

import { dbConnect } from "@/lib/db";
import Itinerary from "@/models/Itinerary";
import Sightseeing from "@/models/Sightseeing";
import Query from "@/models/Query";
import Vehicle from "@/models/Vehicle";
import { revalidatePath } from "next/cache";

// 1. FETCH: Get existing options for a specific query
export async function getItineraries(queryId: string) {
  await dbConnect();
  const paddedId = String(queryId).padStart(5, '0');
  const unpaddedId = String(parseInt(queryId, 10));
  const data = await Itinerary.find({ query_id: { $in: [paddedId, unpaddedId, queryId] } }).sort({ createdAt: 1 });
  return JSON.parse(JSON.stringify(data));
}

// 1.5. FETCH: Get Title of Query
export async function getQueryTitle(queryId: string) {
  await dbConnect();
  const paddedId = String(queryId).padStart(5, '0');
  const query = await Query.findOne({ queryNumber: paddedId }).select("queryName").lean();
  return query ? (query as any).queryName : `Query #${paddedId}`;
}

// 2. CREATE: Add a new option (a, b, c...)
// Updated to include the new Excel-style fields by default
export async function createItinerary(queryId: string, code: string, name: string) {
  await dbConnect();
  const paddedId = String(queryId).padStart(5, '0');
  const newItin = await Itinerary.create({
    query_id: paddedId,
    itinerary_code: code,
    version_name: name,
    days: [
      { 
        date: "", 
        vehicle: "ALPHARD PVT", 
        guide: "ENGLISH SPEAKING GUIDE", 
        serviceTime: "10HRS", 
        stayingCity: "", 
        hotelName: "", 
        activities: [], 
        meals: { breakfast: true, lunch: false, dinner: false } 
      }
    ]
  });
  revalidatePath(`/qmake/${paddedId}`);
  return JSON.parse(JSON.stringify(newItin));
}

// 3. FETCH: Get unique Query IDs we have worked on
export async function getAllActiveQueries() {
  await dbConnect();
  const activeQueries = await Itinerary.distinct("query_id");
  
  const paddedQueryIds = activeQueries.map(id => String(id).padStart(5, '0'));

  const queryDocs = await Query.find({ queryNumber: { $in: paddedQueryIds } }).select("queryNumber queryName").lean();
  
  const queryMap = new Map(queryDocs.map(q => [(q as any).queryNumber, (q as any).queryName]));

  return activeQueries.map(id => {
    const paddedId = String(id).padStart(5, '0');
    return {
      id: paddedId,
      name: queryMap.get(paddedId) || `Query #${paddedId}`
    };
  });
}

// 4. SEARCH: Sightseeing Database
export async function searchSightseeing(query: string) {
  try {
    await dbConnect();
    if (!query || query.length < 2) return [];

    const results = await Sightseeing.find({
      name_en: { $regex: query, $options: "i" }
    })
    .select("name_en adult_price category_primary municipality")
    .limit(10)
    .lean();

    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.error("Search Action Error:", error);
    return [];
  }
}

// 4.5. FETCH: Vehicle Registry Resources
export async function getVehicleResources() {
  try {
    await dbConnect();
    const vehicleTypes = await Vehicle.distinct("vehicleType");
    const cities = await Vehicle.distinct("city");
    
    // Sort them for the UI
    return {
      types: vehicleTypes.sort(),
      cities: cities.sort()
    };
  } catch (error) {
    console.error("Fetch Vehicle Resources Error:", error);
    return { types: [], cities: [] };
  }
}

// 5. SAVE: Sync the Excel-Builder data to MongoDB
export async function saveItineraryData(itineraryCode: string, days: any[]) {
  try {
    await dbConnect();

    const formattedDays = days.map(day => ({
      date: day.date || "",
      vehicle: day.vehicle || "NONE",
      guide: day.guide || "NONE",
      serviceTime: day.serviceTime || "",
      stayingCity: day.stayingCity || "",
      hotelName: day.hotelName || "",
      activities: day.activities || [],
      meals: {
        breakfast: day.meals?.breakfast ?? true,
        lunch: day.meals?.lunch ?? false,
        dinner: day.meals?.dinner ?? false,
      }
    }));

    const result = await Itinerary.findOneAndUpdate(
      { itinerary_code: itineraryCode },
      { 
        $set: { 
          days: formattedDays,
          updatedAt: new Date() 
        } 
      },
      { upsert: true, new: true }
    );

    revalidatePath(`/qmake`);
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.error("Database Save Error:", error);
    throw new Error("Failed to sync itinerary with database");
  }
}

// 6. FETCH: Get a single itinerary by its code
export async function getItineraryByCode(itineraryCode: string) {
  try {
    await dbConnect();
    const data = await Itinerary.findOne({ itinerary_code: itineraryCode }).lean();
    return data ? JSON.parse(JSON.stringify(data)) : null;
  } catch (error) {
    console.error("Get Itinerary Error:", error);
    return null;
  }
}