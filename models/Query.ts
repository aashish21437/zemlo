import mongoose from 'mongoose';

const QuerySchema = new mongoose.Schema({
  queryNumber: { type: String, required: true, unique: true },
  queryName: { type: String },
  owner: { type: String },
  queryType: { type: String },
  agentEmail: { type: String },
  phone: { type: String },
  country: { type: String },
  arrivalDate: { type: String },
  departureDate: { type: String },
  nights: { type: Number },
  agentCode: { type: String },
  agentName: { type: String },
  guests: { type: Number },
  status: { type: String, default: 'Query Received' },
}, { timestamps: true });

export default mongoose.models.Query || mongoose.model('Query', QuerySchema);
