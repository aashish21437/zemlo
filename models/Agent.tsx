import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  agentNumber: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  agentName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  status: { type: String, default: 'active' },
}, { timestamps: true });

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema);
