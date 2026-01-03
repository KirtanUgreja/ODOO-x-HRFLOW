"use server"

import { db } from "@/lib/db"
import { users, profiles } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { hashPassword, getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createEmployee(prevState: any, formData: FormData) {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
        return { error: "Unauthorized" }
    }

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const role = (formData.get("role") as string) || 'employee'
    const phone = formData.get("phone") as string

    if (!email || !password || !fullName) {
        return { error: "Missing required fields" }
    }

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email))
        if (existingUser.length > 0) {
            return { error: "User already exists" }
        }

        const hashedPassword = await hashPassword(password)

        const [newUser] = await db.insert(users).values({
            email,
            password_hash: hashedPassword,
            full_name: fullName,
            role,
            phone,
        }).returning()

        await db.insert(profiles).values({
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
        })

        revalidatePath('/employees')
        return { success: "Employee created successfully" }
    } catch (error) {
        console.error("Create employee error:", error)
        return { error: "Failed to create employee" }
    }
}

export async function getEmployees() {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
        return []
    }

    // Fetch users with profiles
    const allUsers = await db.select().from(users).orderBy(desc(users.created_at))
    return allUsers
}

export async function deleteEmployee(userId: string) {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
        return { error: "Unauthorized" }
    }

    try {
        // Delete related data first (cascade should handle it if setup, but let's be safe)
        // Drizzle schema didn't show cascade explicitly in foreign keys? 
        // References are present. pgTable definitions.
        // Assuming minimal cascade or manual cleanup.
        // Let's just delete from users, if FK constraints fail we refine.
        // Users table assumes it cascades to profiles? Schema says references() but not onDelete cascade.
        // I might need to delete profile first.

        await db.delete(profiles).where(eq(profiles.id, userId))
        await db.delete(users).where(eq(users.id, userId))

        revalidatePath('/employees')
        return { success: "Employee deleted" }
    } catch (error) {
        console.error("Delete error", error)
        return { error: "Failed to delete" }
    }
}

export async function updateEmployee(prevState: any, formData: FormData) {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
        return { error: "Unauthorized" }
    }

    const userId = formData.get("id") as string
    const email = formData.get("email") as string
    const fullName = formData.get("fullName") as string
    const role = formData.get("role") as string
    // Maybe password reset here too? handled separately typically.

    try {
        await db.update(users).set({
            email,
            full_name: fullName,
            role
        }).where(eq(users.id, userId))

        // Update profile too if needed
        await db.update(profiles).set({
            email,
            full_name: fullName
        }).where(eq(profiles.id, userId))

        revalidatePath('/employees')
        return { success: "Updated successfully" }
    } catch (error) {
        console.error("Update error", error)
        return { error: "Failed to update" }
    }
}
