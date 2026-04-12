import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
  featureKey: { type: String, required: true, unique: true },
  allowedRoles: { 
    type: [String], 
    default: ['ADMIN'] // Default to Admin only for new features
  }
}, { timestamps: true });

export default mongoose.models.Permission || mongoose.model('Permission', PermissionSchema);
