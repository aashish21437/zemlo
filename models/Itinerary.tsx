import mongoose from "mongoose";

const DaySchema = new mongoose.Schema({
  date: String,
  vehicle: String,        // Added
  guide: String,          // Added
  serviceTime: String,    // Added
  stayingCity: String,    // Added
  hotelName: String,      // Added
  activities: [Object],   // Array of Sightseeing objects
  meals: {                // Added fallback structure
    breakfast: { type: Boolean, default: true },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  }
});

const ItinerarySchema = new mongoose.Schema({
  itinerary_code: { type: String, required: true, unique: true },
  query_id: { type: String, required: true },
  days: [DaySchema],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Itinerary || mongoose.model("Itinerary", ItinerarySchema);