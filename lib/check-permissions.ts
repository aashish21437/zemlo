import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/db";
import Permission from "@/models/Permission";
import User from "@/models/User";

/**
 * Checks if the currently logged in user has a specific permission.
 * USE: const allowed = await checkPermission('vehicle_bulk_upload');
 */
export async function checkPermission(featureKey: string) {
    const session = await getServerSession();
    if (!session?.user?.email) return false;

    try {
        await dbConnect();
        
        // 1. Get the user's role
        const user = await User.findOne({ email: session.user.email });
        if (!user) return false;
        
        const userRole = user.role;
        if (userRole === 'ADMIN') return true; // Admins ALWAYS have access

        // 2. Get the permission settings for this feature
        const permission = await Permission.findOne({ featureKey });
        
        // If no permission record exists yet, only ADMIN has access by default
        if (!permission) return false;

        // If 'EVERYONE' is allowed, anyone with a login can access
        if (permission.allowedRoles.includes('EVERYONE')) return true;

        return permission.allowedRoles.includes(userRole);
    } catch (error) {
        console.error("Permission Check Error:", error);
        return false;
    }
}

/**
 * Hook-like function for server components to check multiple permissions or get the user object.
 */
export async function getCurrentUserWithPermissions() {
    const session = await getServerSession();
    if (!session?.user?.email) return null;

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return user;
}
