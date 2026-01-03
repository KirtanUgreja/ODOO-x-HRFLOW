
"use server"

import { db } from "@/lib/db"
import { users, profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { hashPassword, verifyPassword, createSession, deleteSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function signup(prevState: any, formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const phone = formData.get("phone") as string

    if (!email || !password || !fullName) {
        return { error: "Missing required fields" }
    }

    try {
        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email))
        if (existingUser.length > 0) {
            return { error: "User already exists" }
        }

        const hashedPassword = await hashPassword(password)

        // Create user
        const [newUser] = await db.insert(users).values({
            email,
            password_hash: hashedPassword,
            full_name: fullName,
            phone,
            role: 'admin', // Public signup is for admins
        }).returning()

        // Create empty profile
        await db.insert(profiles).values({
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
        })

        // Create session
        await createSession(newUser.id, newUser.role)
    } catch (error) {
        console.error("Signup error:", error)
        return { error: "Failed to create account" }
    }

    redirect("/")
}

export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Missing required fields" }
    }

    try {
        const [user] = await db.select().from(users).where(eq(users.email, email))

        if (!user) {
            return { error: "Invalid credentials" }
        }

        const isValid = await verifyPassword(password, user.password_hash)
        if (!isValid) {
            return { error: "Invalid credentials" }
        }

        // Ensure profile exists
        const existingProfile = await db.select().from(profiles).where(eq(profiles.id, user.id))
        if (existingProfile.length === 0) {
            await db.insert(profiles).values({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })
        }

        await createSession(user.id, user.role)
    } catch (error) {
        console.error("Login error:", error)
        return { error: "Internal server error" }
    }

    redirect("/")
}

export async function logout() {
    await deleteSession()
    redirect("/login")
}
