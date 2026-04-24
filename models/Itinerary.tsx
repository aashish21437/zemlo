import mongoose from "mongoose";

// Flat row schema – one row = one line in the Excel grid
const RowSchema = new mongoose.Schema({
  date: { type: String, default: '' },
  vehicle: { type: String, default: '' },
  vehicleCity: { type: String, default: '' },
  vendorName: { type: String, default: '' },
  vehicleServiceType: { type: String, default: '' },
  vehicleAmount: { type: Number, default: null },
  guide: { type: String, default: '' },
  serviceTime: { type: String, default: '' },
  sightseeingName: { type: String, default: '' },   // legacy
  sightseeings: {
    type: [{
      name:        { type: String, default: '' },
      adultPrice:  { type: Number, default: null },
    }],
    default: [],
  },
  mealBreakfast: { type: Boolean, default: false },
  mealLunch: { type: Boolean, default: false },
  mealDinner: { type: Boolean, default: false },
  hotelName: { type: String, default: '' },
  stayingCity: { type: String, default: '' },
});

const ItinerarySchema = new mongoose.Schema({
  itinerary_code: { type: String, required: true, unique: true },
  query_id: { type: String, required: true },
  rows: [RowSchema],          // new flat Excel-style rows
  updatedAt: { type: Date, default: Date.now }
});

if (mongoose.models.Itinerary) {
  delete mongoose.models.Itinerary;
}

export default mongoose.model("Itinerary", ItinerarySchema);