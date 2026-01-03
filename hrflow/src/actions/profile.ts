
"use server"

import { db } from "@/lib/db"
import { profiles, personalInfo, bankingInfo, skills, users } from "@/db/schema"
import { eq, getTableColumns } from "drizzle-orm"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getProfile() {
    const session = await getSession()
    if (!session) return null

    try {
        const [result] = await db.select({
            ...getTableColumns(profiles),
            role: users.role
        })
            .from(profiles)
            .innerJoin(users, eq(profiles.id, users.id))
            .where(eq(profiles.id, session.userId))

        return result
    } catch (error) {
        console.error("Error fetching profile:", error)
        return null
    }
}

export async function getFullProfileData() {
    const session = await getSession()
    if (!session) return null
    const userId = session.userId

    const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId))
    const [personal] = await db.select().from(personalInfo).where(eq(personalInfo.user_id, userId))
    const [banking] = await db.select().from(bankingInfo).where(eq(bankingInfo.user_id, userId))
    const userSkills = await db.select().from(skills).where(eq(skills.user_id, userId))

    return {
        profile,
        personal,
        banking,
        skills: userSkills
    }
}

export async function updatePersonalInfo(data: any) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        await db.insert(personalInfo).values({
            user_id: session.userId,
            ...data,
            updated_at: new Date()
        }).onConflictDoUpdate({
            target: personalInfo.user_id,
            set: {
                ...data,
                updated_at: new Date()
            }
        })
        return { success: true }
    } catch (e) {
        console.error('Database error in updatePersonalInfo:', e)
        return { error: "Failed to update personal information" }
    }
}

export async function updateBankingInfo(data: any) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        await db.insert(bankingInfo).values({
            user_id: session.userId,
            ...data
        }).onConflictDoUpdate({
            target: bankingInfo.user_id,
            set: data
        })
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to update" }
    }
}

export async function addSkill(skillName: string) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        const [newSkill] = await db.insert(skills).values({
            user_id: session.userId,
            skill_name: skillName,
            proficiency_level: "Intermediate"
        }).returning()
        revalidatePath('/profile')
        return { data: newSkill }
    } catch (e) {
        return { error: "Failed to add skill" }
    }
}

export async function removeSkill(skillId: string) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        await db.delete(skills).where(eq(skills.id, skillId))
        revalidatePath('/profile')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete skill" }
    }
}

export async function updateBasicProfile(prevState: any, formData: FormData) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    const fullName = formData.get("fullName") as string
    const phone = formData.get("phone") as string
    const location = formData.get("location") as string
    const about = formData.get("about") as string

    try {
        // Update user table
        await db.update(users).set({
            full_name: fullName,
            phone: phone
        }).where(eq(users.id, session.userId))

        // Update profile table
        await db.update(profiles).set({
            full_name: fullName, // keeping redundant in sync if needed, or rely on joins. Assuming simple sync.
            location: location,
            about: about,
            // company: formData.get("company") as string || 'Dayflow', // Avoid overwriting if not provided, or handle elsewhere
            // department: formData.get("department") as string
        }).where(eq(profiles.id, session.userId))

        revalidatePath('/profile')
        return { success: "Profile updated successfully" }
    } catch (e) {
        console.error("Update profile error:", e)
        return { error: "Failed to update profile" }
    }
}
