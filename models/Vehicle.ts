import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  pricing_id: { type: String, unique: true }, // e.g. VP-00001
  vehicleType: { type: String, required: true }, // e.g. ALPHARD, HIACE
  vendorName: { type: String, required: true },
  city: { type: String },
  contactPhone: { type: String },
  contactEmail: { type: String },
  prices: {
    fix10Hours: { type: Number, default: 0 },
    fix12Hours: { type: Number, default: 0 },
    airportTransfer: { type: Number, default: 0 },
    stationTransfer: { type: Number, default: 0 },
    hourlyOvertime: { type: Number, default: 0 },
  }
}, { timestamps: true });

export default mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);
