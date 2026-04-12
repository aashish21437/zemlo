"use server"

import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import clientPromise, { dbConnect } from "@/lib/db";
import Agent from "@/models/Agent";
import Query from "@/models/Query";
import { checkPermission } from "@/lib/check-permissions";

const DB_NAME = "zemlo";

// --- AGENT ACTIONS ---

export async function registerAgent(formData: FormData) {
  if (!(await checkPermission('crm_create'))) {
    return { error: "Unauthorized: Agent registration permission required" };
  }
  try {
    await dbConnect();

    const companyName = (formData.get("company") as string).trim();
    const agentName = (formData.get("agentName") as string).trim();
    const email = (formData.get("email") as string).trim();
    const phone = (formData.get("phone") as string).trim();
    const address = (formData.get("address") as string).trim();

    const existing = await Agent.findOne({ 
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") } 
    });
    
    if (existing) return { error: "This company is already registered." };

    const count = await Agent.countDocuments();
    const agentNumber = (count + 1).toString().padStart(4, '0');

    await Agent.create({
      agentNumber,
      companyName,
      agentName,
      email,
      phone,
      address,
      status: "active",
    });

    revalidatePath('/qreg');
    return { success: true, agentNumber };
  } catch (e: any) {
    return { error: "Database Error. Check your connection." };
  }
}

export async function getAgents() {
  if (!(await checkPermission('crm_view'))) return [];
  try {
    await dbConnect();
    const agents = await Agent.find({}).sort({ createdAt: -1 }).lean();
    return agents.map((agent: any) => ({ ...agent, _id: agent._id.toString() }));
  } catch (e) {
    return [];
  }
}

// --- QUERY ACTIONS ---

export async function registerQuery(formData: FormData) {
  if (!(await checkPermission('crm_create'))) {
    return { error: "Unauthorized: Query registration permission required" };
  }
  try {
    await dbConnect();

    // 1. Generate 5-digit Query Number
    const count = await Query.countDocuments();
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
      status: formData.get("status") || "Query Received"
    };

    await Query.create(data);
    revalidatePath('/qreg/query');
    return { success: true, queryNumber, queryName };
  } catch (e) {
    console.error(e);
    return { error: "Failed to register query." };
  }
}

export async function getQueries() {
  if (!(await checkPermission('crm_view'))) return [];
  await dbConnect();
  const data = await Query.find({}).sort({ createdAt: -1 }).lean();
  return data.map((q: any) => ({ ...q, _id: q._id.toString() }));
}

export async function getQueryById(id: string) {
  if (!(await checkPermission('crm_view'))) return null;
  if (!id || id === 'new') return null;
  try {
    await dbConnect();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let query: any;
    if (isObjectId) {
      query = await Query.findById(id).lean();
    }
    if (!query) {
      query = await Query.findOne({ queryNumber: id }).lean();
    }
    if (!query) return null;
    return { ...query, _id: query._id.toString() };
  } catch (e) {
    return null;
  }
}

export async function updateQuery(id: string, updateData: any) {
  if (!(await checkPermission('crm_edit'))) {
    return { error: "Unauthorized: Query edit permission required" };
  }
  try {
    await dbConnect();
    
    const { _id, ...data } = updateData;

    // Recalculate everything for the new name
    const nights = parseInt(data.nights) || 0;
    const days = nights + 1;
    const dateParts = data.arrivalDate ? data.arrivalDate.split('-') : ["0000", "00", "00"];
    const ddmm = `${dateParts[2]}${dateParts[1]}`;
    
    // Update Name: 00009 ASAHI 0004 JAPAN 1704 6N7D X 3 PAX
    data.queryName = `${data.queryNumber} ASAHI ${data.agentCode} JAPAN ${ddmm} ${nights}N${days}D X ${data.pax} PAX`;

    await Query.findByIdAndUpdate(id, data);
    revalidatePath('/qreg/query');
    return { success: true, queryNumber: data.queryNumber };
  } catch (e) {
    console.error(e);
    return { error: "Update failed." };
  }
}

// 1. Add getAgentById so we can fetch specific agent data
export async function getAgentById(id: string) {
  if (!(await checkPermission('crm_view'))) return null;
  try {
    await dbConnect();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let agent: any;
    if (isObjectId) {
      agent = await Agent.findById(id).lean();
    }
    if (!agent) {
      agent = await Agent.findOne({ agentNumber: id }).lean();
    }
    if (!agent) return null;
    return { ...agent, _id: agent._id.toString() };
  } catch (e) {
    console.error("Fetch Agent Error:", e);
    return null;
  }
}

// 2. Add updateAgent so we can save changes to an existing agent
export async function updateAgent(id: string, formData: FormData) {
  if (!(await checkPermission('crm_edit'))) {
    return { error: "Unauthorized: Agent edit permission required" };
  }
  try {
    await dbConnect();
    
    // Map the FormData back to the database fields
    const updateData = {
      companyName: (formData.get("company") as string).trim(),
      agentName: (formData.get("agentName") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      address: (formData.get("address") as string).trim(),
    };

    await Agent.findByIdAndUpdate(id, updateData);
    
    revalidatePath('/qreg');
    return { success: true };
  } catch (e) {
    console.error("Update Agent Error:", e);
    return { error: "Failed to update agent details." };
  }
}

export async function deleteQuery(id: string) {
  if (!(await checkPermission('crm_delete'))) {
    return { error: "Unauthorized: Query deletion permission required" };
  }
  try {
    await dbConnect();
    
    const result = await Query.findByIdAndDelete(id);

    if (result) {
      return { success: true };
    } else {
      return { error: "Query not found or already deleted." };
    }
  } catch (e) {
    console.error("Delete Error:", e);
    return { error: "Failed to delete the query." };
  }
}