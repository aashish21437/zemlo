"use server"

import { ObjectId } from 'mongodb';
import clientPromise from "@/lib/db";

const DB_NAME = "zemlo";

// --- AGENT ACTIONS ---

export async function registerAgent(formData: FormData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME); 
    const collection = db.collection("agents");

    const companyName = (formData.get("company") as string).trim();
    const agentName = (formData.get("agentName") as string).trim();
    const email = (formData.get("email") as string).trim();
    const phone = (formData.get("phone") as string).trim();
    const address = (formData.get("address") as string).trim();

    const existing = await collection.findOne({ 
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") } 
    });
    
    if (existing) return { error: "This company is already registered." };

    const count = await collection.countDocuments();
    const agentNumber = (count + 1).toString().padStart(4, '0');

    await collection.insertOne({
      agentNumber,
      companyName,
      agentName,
      email,
      phone,
      address,
      status: "active",
      createdAt: new Date(),
    });

    return { success: true, agentNumber };
  } catch (e: any) {
    return { error: "Database Error. Check your connection." };
  }
}

export async function getAgents() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const agents = await db.collection("agents").find({}).sort({ createdAt: -1 }).toArray();
    return agents.map(agent => ({ ...agent, _id: agent._id.toString() }));
  } catch (e) {
    return [];
  }
}

// --- QUERY ACTIONS ---

export async function registerQuery(formData: FormData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("queries");

    // 1. Generate 5-digit Query Number
    const count = await collection.countDocuments();
    const queryNumber = (count + 1).toString().padStart(5, '0');

    // 2. Extract Data
    const arrivalDate = formData.get("arrivalDate") as string; // YYYY-MM-DD
    const agentCode = formData.get("agentCode") as string;
    const pax = formData.get("pax") || formData.get("guests") || "1";
    const nights = parseInt(formData.get("nights") as string) || 0;
    const days = nights + 1;
    
    // 3. Format Date (DDMM)
    const dateParts = arrivalDate ? arrivalDate.split('-') : ["0000", "00", "00"];
    const ddmm = `${dateParts[2]}${dateParts[1]}`;

    // 4. Construct Final Name: 00009 ASAHI 0004 JAPAN 1704 6N7D X 3 PAX
    const queryName = `${queryNumber} ASAHI ${agentCode} JAPAN ${ddmm} ${nights}N${days}D X ${pax} PAX`;

    const data = {
      queryNumber,
      queryName,
      owner: formData.get("owner"),
      queryType: formData.get("queryType"),
      agentEmail: formData.get("email"),
      phone: formData.get("phone"),
      country: formData.get("country"),
      arrivalDate: arrivalDate,
      departureDate: formData.get("departureDate"),
      nights: nights,
      agentCode,
      agentName: formData.get("contactName"),
      guests: parseInt(pax as string),
      status: formData.get("status") || "Query Received",
      createdAt: new Date(),
    };

    await collection.insertOne(data);
    return { success: true, queryNumber, queryName };
  } catch (e) {
    console.error(e);
    return { error: "Failed to register query." };
  }
}

export async function getQueries() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const data = await db.collection("queries").find({}).sort({ createdAt: -1 }).toArray();
  return data.map(q => ({ ...q, _id: q._id.toString() }));
}

export async function getQueryById(id: string) {
  if (!id || id === 'new') return null;
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const query = await db.collection("queries").findOne({ _id: new ObjectId(id) });
    if (!query) return null;
    return { ...query, _id: query._id.toString() };
  } catch (e) {
    return null;
  }
}

export async function updateQuery(id: string, updateData: any) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const { _id, ...data } = updateData;

    // Recalculate everything for the new name
    const nights = parseInt(data.nights) || 0;
    const days = nights + 1;
    const dateParts = data.arrivalDate ? data.arrivalDate.split('-') : ["0000", "00", "00"];
    const ddmm = `${dateParts[2]}${dateParts[1]}`;
    
    // Update Name: 00009 ASAHI 0004 JAPAN 1704 6N7D X 3 PAX
    data.queryName = `${data.queryNumber} ASAHI ${data.agentCode} JAPAN ${ddmm} ${nights}N${days}D X ${data.pax} PAX`;

    await db.collection("queries").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Update failed." };
  }
}

// 1. Add getAgentById so we can fetch specific agent data
export async function getAgentById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const agent = await db.collection("agents").findOne({ _id: new ObjectId(id) });
    if (!agent) return null;
    return { ...agent, _id: agent._id.toString() };
  } catch (e) {
    console.error("Fetch Agent Error:", e);
    return null;
  }
}

// 2. Add updateAgent so we can save changes to an existing agent
export async function updateAgent(id: string, formData: FormData) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Map the FormData back to the database fields
    const updateData = {
      companyName: (formData.get("company") as string).trim(),
      agentName: (formData.get("agentName") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      address: (formData.get("address") as string).trim(),
      updatedAt: new Date(),
    };

    await db.collection("agents").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return { success: true };
  } catch (e) {
    console.error("Update Agent Error:", e);
    return { error: "Failed to update agent details." };
  }
}

export async function deleteQuery(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const result = await db.collection("queries").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 1) {
      return { success: true };
    } else {
      return { error: "Query not found or already deleted." };
    }
  } catch (e) {
    console.error("Delete Error:", e);
    return { error: "Failed to delete the query." };
  }
}