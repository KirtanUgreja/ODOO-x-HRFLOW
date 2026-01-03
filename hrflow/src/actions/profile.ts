
"use server"

import { db } from "@/lib/db"
import { profiles, personalInfo, bankingInfo, skills, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getSession } from "@/lib/auth"

export async function getProfile() {
    const session = await getSession()
    if (!session) return null

    try {
        const [userProfile] = await db.select().from(profiles).where(eq(profiles.id, session.userId))
        return userProfile
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
            ...data
        }).onConflictDoUpdate({
            target: personalInfo.user_id,
            set: data
        })
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to update" }
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
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete skill" }
    }
}
