"use server";

import { revalidatePath } from 'next/cache';
import { dbConnect } from "@/lib/db";
import Vehicle from "@/models/Vehicle";

// Helper: generate the next VP-XXXXX id
async function generatePricingId(): Promise<string> {
  const count = await Vehicle.countDocuments();
  return `VP-${(count + 1).toString().padStart(5, '0')}`;
}

// Helper: parse a row of pricing data from FormData or CSV
function parsePrices(data: Record<string, string>) {
  return {
    fix10Hours: parseFloat(data.fix10Hours) || 0,
    fix12Hours: parseFloat(data.fix12Hours) || 0,
    airportTransfer: parseFloat(data.airportTransfer) || 0,
    stationTransfer: parseFloat(data.stationTransfer) || 0,
    hourlyOvertime: parseFloat(data.hourlyOvertime) || 0,
  };
}

export async function getVehicles() {
  await dbConnect();
  const vehicles = await Vehicle.find({}).sort({ createdAt: -1 }).lean();
  return vehicles.map((v: any) => ({ ...v, _id: v._id.toString() }));
}

export async function getVehicleById(id: string) {
  if (!id || id === 'new') return null;
  try {
    await dbConnect();
    const vehicle = await Vehicle.findById(id).lean();
    if (!vehicle) return null;
    return { ...(vehicle as any), _id: (vehicle as any)._id.toString() };
  } catch (e) {
    console.error("Fetch Vehicle Error:", e);
    return null;
  }
}

export async function registerVehicle(formData: FormData) {
  try {
    await dbConnect();
    const pricing_id = await generatePricingId();

    const raw: Record<string, string> = {};
    formData.forEach((val, key) => { raw[key] = val as string; });

    await Vehicle.create({
      pricing_id,
      vehicleType: raw.vehicleType?.trim(),
      vendorName: raw.vendorName?.trim(),
      city: raw.city?.trim(),
      contactPhone: raw.contactPhone?.trim(),
      contactEmail: raw.contactEmail?.trim(),
      prices: parsePrices(raw),
    });

    revalidatePath('/vehicle');
    return { success: true, pricing_id };
  } catch (e) {
    console.error("Register Vehicle Error:", e);
    return { error: "Failed to register vehicle pricing." };
  }
}

export async function updateVehicle(id: string, formData: FormData) {
  try {
    await dbConnect();
    const raw: Record<string, string> = {};
    formData.forEach((val, key) => { raw[key] = val as string; });

    await Vehicle.findByIdAndUpdate(id, {
      vehicleType: raw.vehicleType?.trim(),
      vendorName: raw.vendorName?.trim(),
      city: raw.city?.trim(),
      contactPhone: raw.contactPhone?.trim(),
      contactEmail: raw.contactEmail?.trim(),
      prices: parsePrices(raw),
    });

    revalidatePath('/vehicle');
    return { success: true };
  } catch (e) {
    console.error("Update Vehicle Error:", e);
    return { error: "Failed to update vehicle pricing." };
  }
}

export async function deleteVehicle(id: string) {
  try {
    await dbConnect();
    const result = await Vehicle.findByIdAndDelete(id);
    if (result) {
      revalidatePath('/vehicle');
      return { success: true };
    }
    return { error: "Record not found or already deleted." };
  } catch (e) {
    console.error("Delete Vehicle Error:", e);
    return { error: "Failed to delete the record." };
  }
}

export async function bulkRegisterVehicles(rows: any[]) {
  try {
    await dbConnect();
    const count = await Vehicle.countDocuments();

    const docs = rows.map((row, i) => ({
      pricing_id: `VP-${(count + i + 1).toString().padStart(5, '0')}`,
      vehicleType: (row.vehicleType || '').trim().toUpperCase(),
      vendorName: (row.vendorName || '').trim().toUpperCase(),
      city: (row.city || '').trim().toUpperCase(),
      contactPhone: (row.contactPhone || '').trim(),
      contactEmail: (row.contactEmail || '').trim(),
      prices: {
        fix10Hours: parseFloat(row.fix10Hours) || 0,
        fix12Hours: parseFloat(row.fix12Hours) || 0,
        airportTransfer: parseFloat(row.airportTransfer) || 0,
        stationTransfer: parseFloat(row.stationTransfer) || 0,
        hourlyOvertime: parseFloat(row.hourlyOvertime) || 0,
      },
    }));

    await Vehicle.insertMany(docs, { ordered: false });
    revalidatePath('/vehicle');
    return { success: true, count: docs.length };
  } catch (e: any) {
    console.error("Bulk Register Vehicle Error:", e);
    return { error: "Bulk import failed. Check for duplicate rows." };
  }
}
