"use server";

import { dbConnect } from "@/lib/db";
import Itinerary from "@/models/Itinerary";
import Sightseeing from "@/models/Sightseeing"; // <--- ADD THIS LINE
import { revalidatePath } from "next/cache";

// ... rest of your functions




// FETCH: Get existing options for the query
export async function getItineraries(queryId: string) {
  await dbConnect();
  const data = await Itinerary.find({ query_id: queryId }).sort({ createdAt: 1 });
  return JSON.parse(JSON.stringify(data));
}

// CREATE: Add a new option (a, b, c...)
export async function createItinerary(queryId: string, code: string, name: string) {
  await dbConnect();
  const newItin = await Itinerary.create({
    query_id: queryId,
    itinerary_code: code,
    version_name: name,
    days: [
        { stay: "", activities: [], notes: "" },
        { stay: "", activities: [], notes: "" }
    ]
  });
  revalidatePath(`/qmake/${queryId}`);
  return JSON.parse(JSON.stringify(newItin));
}

// Add this to app/qmake/actions.ts
// export async function getAllActiveQueries() {
//   await dbConnect();
//   // This finds all itineraries, groups them by query_id, 
//   // and brings back the unique list of queries you've worked on.
//   const activeQueries = await Itinerary.distinct("query_id");
//   return activeQueries;
// }

// app/qmake/actions.ts
export async function getAllActiveQueries() {
  await dbConnect();
  // Get unique IDs from the itineraries we've actually started
  const activeQueries = await Itinerary.distinct("query_id");
  return activeQueries; 
}

export async function searchSightseeing(query: string) {
  try {
    await dbConnect();
    
    if (!query || query.length < 2) return [];

    // 'i' makes it case-insensitive
    const results = await Sightseeing.find({
      name_en: { $regex: query, $options: "i" }
    })
    .select("name_en adult_price category_primary municipality") // Only pull what we need
    .limit(10)
    .lean();

    console.log(`Search for "${query}" found ${results.length} items`);
    
    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.error("Search Action Error:", error);
    return [];
  }
}


export async function saveItineraryData(itineraryCode: string, days: any[]) {
  try {
    await dbConnect();

    // Find the itinerary by its unique code (e.g., 0001a) and update the days array
    const updated = await Itinerary.findOneAndUpdate(
      { itinerary_code: itineraryCode },
      { $set: { days: days } },
      { new: true, upsert: true } // upsert creates it if it doesn't exist
    );

    // This clears the Next.js cache so the updated data shows up everywhere
    revalidatePath(`/qmake/${itineraryCode}`);
    
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Database Save Error:", error);
    throw new Error("Failed to save itinerary data");
  }
}

// Add this to app/qmake/actions.ts

export async function getItineraryByCode(itineraryCode: string) {
  try {
    await dbConnect();
    
    // Find the specific itinerary (e.g., "0001a")
    const data = await Itinerary.findOne({ itinerary_code: itineraryCode }).lean();

    if (!data) {
      return null;
    }

    // We use JSON.parse(JSON.stringify()) to strip out Mongoose-specific 
    // metadata that Next.js can't pass from Server to Client
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching itinerary by code:", error);
    return null;
  }
}

// app/qmake/actions.ts

// This function fetches the specific data needed for the PDF
export async function getItineraryForPDF(itineraryCode: string) {
  try {
    await dbConnect();
    const data = await Itinerary.findOne({ itinerary_code: itineraryCode }).lean();
    return data ? JSON.parse(JSON.stringify(data)) : null;
  } catch (error) {
    console.error("PDF Data Fetch Error:", error);
    return null;
  }
}