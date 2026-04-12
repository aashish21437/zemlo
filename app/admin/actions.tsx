"use server";

import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { checkPermission } from "@/lib/check-permissions";

// 1. HELPERS: Check if current session is Admin
async function isAdmin() {
    const session = await getServerSession();
    if (!session?.user?.email) return false;
    
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return user?.role === 'ADMIN';
}

// 2. FETCH: Get all users
export async function getAllUsers() {
    if (!(await checkPermission('admin_users'))) {
        throw new Error("Unauthorized: User management permission required");
    }
    
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(users));
}

// 3. UPDATE: Change user role
export async function updateUserRole(userId: string, newRole: string) {
    if (!(await checkPermission('admin_users'))) {
        throw new Error("Unauthorized: User management permission required");
    }

    const validRoles = ['ADMIN', 'MANAGER', 'EXECUTIVE', 'VIEWER'];
    if (!validRoles.includes(newRole)) {
        throw new Error("Invalid role specified");
    }

    await dbConnect();
    
    // Prevent removing the last admin? (Optional safety)
    if (newRole !== 'ADMIN') {
        const adminCount = await User.countDocuments({ role: 'ADMIN' });
        const targetUser = await User.findById(userId);
        if (adminCount <= 1 && targetUser?.role === 'ADMIN') {
            throw new Error("Cannot remove the last administrator");
        }
    }

    await User.findByIdAndUpdate(userId, { role: newRole });
    revalidatePath('/admin/users');
    return { success: true };
}

// 4. DELETE: Remove user
export async function deleteUser(userId: string) {
    if (!(await checkPermission('admin_users'))) {
        throw new Error("Unauthorized: User management permission required");
    }

    await dbConnect();
    
    const adminCount = await User.countDocuments({ role: 'ADMIN' });
    const targetUser = await User.findById(userId);
    if (adminCount <= 1 && targetUser?.role === 'ADMIN') {
        throw new Error("Cannot delete the last administrator");
    }

    await User.findByIdAndDelete(userId);
    revalidatePath('/admin/users');
    return { success: true };
}

// 5. CREATE: Manually add a user (Pre-registration)
export async function createUser(data: { email: string, name?: string, role: string }) {
    if (!(await checkPermission('admin_users'))) {
        throw new Error("Unauthorized: User management permission required");
    }

    const { email, name, role } = data;
    if (!email || !role) {
        throw new Error("Email and Role are required");
    }

    const validRoles = ['ADMIN', 'MANAGER', 'EXECUTIVE', 'VIEWER'];
    if (!validRoles.includes(role)) {
        throw new Error("Invalid role specified");
    }

    await dbConnect();
    
    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
        throw new Error("User with this email already exists");
    }

    const newUser = await User.create({
        email: email.toLowerCase(),
        name: name || "",
        role: role,
        googleId: "", // Will be linked on first login
    });

    revalidatePath('/admin/users');
    return { success: true, user: JSON.parse(JSON.stringify(newUser)) };
}
