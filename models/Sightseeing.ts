import mongoose from 'mongoose';

const SightseeingSchema = new mongoose.Schema({
  sightseeing_id: { type: Number, required: true, unique: true },
  name_en: { type: String, required: true },
  category_primary: { type: String, default: "Historic" },
  municipality: { type: String, required: true },
  adult_price: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.models.Sightseeing || mongoose.model('Sightseeing', SightseeingSchema);
