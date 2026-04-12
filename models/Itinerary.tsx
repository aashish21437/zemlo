import mongoose from 'mongoose';

const ItinerarySchema = new mongoose.Schema({
  query_id: { type: String, required: true }, // e.g., "0001"
  itinerary_code: { type: String, required: true, unique: true }, // e.g., "0001a"
  version_name: { type: String, required: true }, // e.g., "Option A"
  days: { type: Array, default: [
    { stay: "", activities: [], notes: "" },
    { stay: "", activities: [], notes: "" }
  ]},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);