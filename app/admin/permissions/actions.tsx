"use server";

import { dbConnect } from "@/lib/db";
import Permission from "@/models/Permission";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { FEATURE_GROUPS } from "@/lib/permission-config";

// 1. HELPER: Admin Check
async function isAdmin() {
    const session = await getServerSession();
    if (!session?.user?.email) return false;
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return user?.role === 'ADMIN';
}

// 2. FETCH: Get full matrix
export async function getPermissionMatrix() {
    if (!(await isAdmin())) {
        throw new Error("Unauthorized: Admin access required");
    }
    
    await dbConnect();
    const dbPermissions = await Permission.find({});
    
    // Map DB results to a dictionary for easy access
    const matrix: Record<string, string[]> = {};
    dbPermissions.forEach(p => {
        matrix[p.featureKey] = p.allowedRoles;
    });

    // Ensure all features from config exist in the return object
    FEATURE_GROUPS.forEach(group => {
        group.features.forEach(f => {
            if (!matrix[f.id]) {
                matrix[f.id] = ['ADMIN']; // Default to Admin if missing
            }
        });
    });

    return matrix;
}

// 3. UPDATE: Toggle a permission
export async function togglePermission(featureKey: string, role: string) {
    if (!(await isAdmin())) {
        throw new Error("Unauthorized: Admin access required");
    }

    await dbConnect();
    
    const permission = await Permission.findOne({ featureKey });
    
    if (!permission) {
        // Create new record if missing
        await Permission.create({
            featureKey,
            allowedRoles: ['ADMIN', role]
        });
    } else {
        const hasRole = permission.allowedRoles.includes(role);
        if (hasRole) {
            // Can't remove ADMIN from any permission for safety
            if (role === 'ADMIN') return { success: false, message: "Cannot remove Admin access" };
            
            // Remove role
            permission.allowedRoles = permission.allowedRoles.filter((r: string) => r !== role);
        } else {
            // Add role
            permission.allowedRoles.push(role);
        }
        await permission.save();
    }

    revalidatePath('/admin/permissions');
    return { success: true };
}
