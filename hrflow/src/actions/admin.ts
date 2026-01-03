"use server"

import { db } from "@/lib/db"
import { users, profiles, personalInfo, salaryInfo } from "@/db/schema"
import { eq } from "drizzle-orm"
import { hashPassword, getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function isAdmin() {
    const session = await getSession();
    return session && session.role === 'admin';
}

export async function createEmployee(prevState: any, formData: FormData) {
    if (!(await isAdmin())) {
        return { error: "Unauthorized" }
    }

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const phone = formData.get("phone") as string
    const department = formData.get("department") as string
    const designation = formData.get("designation") as string // Assuming 'job_love' or similar? Let's use 'job_love' for now or add to schema if needed. Schema has 'job_love'.

    if (!email || !password || !fullName) {
        return { error: "Missing required fields" }
    }

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email))
        if (existingUser.length > 0) {
            return { error: "User with this email already exists" }
        }

        const hashedPassword = await hashPassword(password)

        // Create User
        const [newUser] = await db.insert(users).values({
            email,
            password_hash: hashedPassword,
            full_name: fullName,
            phone,
            role: 'employee',
        }).returning()

        // Create Profile
        await db.insert(profiles).values({
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
            department: department,
            job_love: designation, // Using job_love for designation/role title
        })

        // Initialize other tables as needed (optional)

    } catch (error) {
        console.error("Create Employee error:", error)
        return { error: "Failed to create employee" }
    }

    revalidatePath("/employees")
    return { success: "Employee created successfully" }
}

export async function deleteEmployee(employeeId: string) {
    if (!(await isAdmin())) {
        return { error: "Unauthorized" }
    }

    try {
        // Cascade delete should be handled by DB if set up, but safe to delete dependents first manually if not.
        // Drizzle schema references don't automatically enforce cascade in migrations unless specified.
        // For now, let's try deleting user, it might fail if FK constraints exist without cascade.
        // Quick fix: Delete related records first.

        await db.delete(profiles).where(eq(profiles.id, employeeId));
        await db.delete(personalInfo).where(eq(personalInfo.user_id, employeeId));
        // Add other tables...

        await db.delete(users).where(eq(users.id, employeeId));

        revalidatePath("/employees")
        return { success: "Employee deleted" }
    } catch (error) {
        console.error("Delete Employee error:", error)
        return { error: "Failed to delete employee" }
    }
}

export async function updateEmployee(prevState: any, formData: FormData) {
    if (!(await isAdmin())) {
        return { error: "Unauthorized" }
    }

    const id = formData.get("id") as string
    const fullName = formData.get("fullName") as string
    const department = formData.get("department") as string
    const designation = formData.get("designation") as string

    try {
        await db.update(users)
            .set({ full_name: fullName })
            .where(eq(users.id, id))

        await db.update(profiles)
            .set({
                full_name: fullName,
                department: department,
                job_love: designation
            })
            .where(eq(profiles.id, id))

    } catch (error) {
        return { error: "Failed to update employee" }
    }

    revalidatePath("/employees")
    return { success: "Employee updated" }
}

export async function resetEmployeePassword(prevState: any, formData: FormData) {
    if (!(await isAdmin())) {
        return { error: "Unauthorized" }
    }

    const id = formData.get("id") as string
    const newPassword = formData.get("password") as string

    try {
        const hashedPassword = await hashPassword(newPassword)
        await db.update(users)
            .set({ password_hash: hashedPassword })
            .where(eq(users.id, id))

    } catch (error) {
        return { error: "Failed to reset password" }
    }

    revalidatePath("/employees")
    return { success: "Password reset successfully" }
}

export async function getEmployees() {
    if (!(await isAdmin())) {
        return []
    }

    // Join users with profiles
    const employees = await db.select({
        id: users.id,
        fullName: users.full_name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        department: profiles.department,
        designation: profiles.job_love,
    })
        .from(users)
        .leftJoin(profiles, eq(users.id, profiles.id))
        .where(eq(users.role, 'employee')); // We might want to list Admins too? "employee list" usually implies generic employees. Let's list everyone or filter. Request said "employee list".

    return employees;
}
