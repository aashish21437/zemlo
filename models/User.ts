import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  image: { type: String },
  role: { 
    type: String, 
    enum: ['ADMIN', 'MANAGER', 'EXECUTIVE', 'VIEWER'], 
    default: 'VIEWER' 
  },
  googleId: { type: String },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
