"use server";

import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Sightseeing from "@/models/Sightseeing";
import { checkPermission } from "@/lib/check-permissions";

/**
 * FEATURE 1: SINGLE SAVE (REGISTRATION & UPDATE)
 */
export async function saveSightseeing(formData: FormData) {
  const idFromUrl = formData.get("current_id") as string;
  const isNew = idFromUrl === "new";

  // 1. Permission Check
  if (isNew) {
    if (!(await checkPermission('sightsee_add'))) {
      throw new Error("Unauthorized: Registration permission required");
    }
  } else {
    if (!(await checkPermission('sightsee_edit_delete'))) {
      throw new Error("Unauthorized: Edit permission required");
    }
  }

  // 2. Establish Connection
  await dbConnect();

  let finalID: number;

  if (isNew) {
    // FIX: Define db directly inside the scope where it's used to satisfy Vercel worker
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");

    // Get next ID from counter
    const counter = await (db as any).collection("counters").findOneAndUpdate(
      { _id: "sightseeing_id" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );

    finalID = counter?.seq || 1000;

    // Insert new record using Mongoose Profile
    await Sightseeing.create({
      sightseeing_id: finalID,
      name_en: formData.get("name_en"),
      category_primary: formData.get("category_primary"),
      municipality: formData.get("municipality"),
      adult_price: Number(formData.get("adult_price")),
    });
  } else {
    // Update existing record using Mongoose Profile
    finalID = parseInt(idFromUrl);
    await Sightseeing.findOneAndUpdate(
      { sightseeing_id: finalID },
      {
        name_en: formData.get("name_en"),
        category_primary: formData.get("category_primary"),
        municipality: formData.get("municipality"),
        adult_price: Number(formData.get("adult_price")),
      }
    );
  }

  revalidatePath("/sightseeing-dashboard");
  redirect(`/sightseeing-dashboard/${finalID}`);
}

/**
 * FEATURE 2: BULK REGISTER
 */
export async function bulkRegisterSightseeings(data: any[]) {
  if (!(await checkPermission('sightsee_bulk'))) {
    throw new Error("Unauthorized: Bulk upload permission required");
  }

  await dbConnect();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection failed");

  const count = data.length;
  if (count === 0) return { success: false, error: "No data" };

  // Reserve a block of IDs for the entire batch
  const counter = await (db as any).collection("counters").findOneAndUpdate(
    { _id: "sightseeing_id" },
    { $inc: { seq: count } },
    { upsert: true, returnDocument: "before" }
  );

  const startingID = (counter?.seq || 1000) + 1;

  // Prepare the batch
  const bulkEntries = data.map((item, index) => ({
    sightseeing_id: startingID + index,
    name_en: item.name_en,
    category_primary: item.category_primary || "Modern",
    municipality: item.municipality || "",
    adult_price: Number(item.adult_price) || 0,
  }));

  // Execute InsertMany using Mongoose Profile
  const result = await Sightseeing.insertMany(bulkEntries);

  revalidatePath("/sightseeing-dashboard");
  return { success: true, count: result.length };
}

/**
 * FEATURE 3: DELETE
 */
export async function deleteSightseeing(id: number) {
  if (!(await checkPermission('sightsee_edit_delete'))) {
    throw new Error("Unauthorized: Delete permission required");
  }

  await dbConnect();
  await Sightseeing.deleteOne({ sightseeing_id: id });

  revalidatePath("/sightseeing-dashboard");
  redirect("/sightseeing-dashboard");
}