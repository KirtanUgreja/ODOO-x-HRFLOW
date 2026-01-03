"use server"

import { db } from "@/lib/db"
import { leaveRequests, users } from "@/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { getSession } from "@/lib/auth"

export async function getLeaveData() {
    const session = await getSession()
    if (!session) return null

    try {
        // Get user's leave requests
        const userLeaves = await db.select()
            .from(leaveRequests)
            .where(eq(leaveRequests.user_id, session.userId))
            .orderBy(desc(leaveRequests.created_at))

        // Calculate leave balance (assuming 24 total leaves per year)
        const currentYear = new Date().getFullYear()
        const usedLeaves = await db.select({
            total: sql<number>`sum(days)`
        })
            .from(leaveRequests)
            .where(eq(leaveRequests.user_id, session.userId))

        const totalLeaves = 24
        const used = Number(usedLeaves[0]?.total || 0)
        const available = totalLeaves - used

        return {
            leaves: userLeaves,
            balance: {
                total: totalLeaves,
                used,
                available
            }
        }
    } catch (error) {
        console.error("Error fetching leave data:", error)
        return null
    }
}

export async function submitLeaveRequest(data: {
    leave_type: string
    start_date: string
    end_date: string
    reason: string
}) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        // Calculate days between dates
        const startDate = new Date(data.start_date)
        const endDate = new Date(data.end_date)
        const timeDiff = endDate.getTime() - startDate.getTime()
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

        const [newLeave] = await db.insert(leaveRequests).values({
            user_id: session.userId,
            leave_type: data.leave_type,
            start_date: data.start_date,
            end_date: data.end_date,
            days: days.toString(),
            reason: data.reason,
            status: 'Pending'
        }).returning()

        return { success: true, data: newLeave }
    } catch (error) {
        console.error("Error submitting leave request:", error)
        return { error: "Failed to submit leave request" }
    }
}


export async function getAllLeaveRequests() {
    const session = await getSession()
    if (!session || session.role !== 'admin') return []

    try {
        const requests = await db.select({
            id: leaveRequests.id,
            leave_type: leaveRequests.leave_type,
            start_date: leaveRequests.start_date,
            end_date: leaveRequests.end_date,
            days: leaveRequests.days,
            reason: leaveRequests.reason,
            status: leaveRequests.status,
            created_at: leaveRequests.created_at,
            full_name: users.full_name,
            email: users.email
        })
            .from(leaveRequests)
            .innerJoin(users, eq(leaveRequests.user_id, users.id))
            .orderBy(desc(leaveRequests.created_at))

        return requests
    } catch (error) {
        console.error("Error fetching leave requests:", error)
        return []
    }
}

export async function updateLeaveStatus(id: string, status: 'Approved' | 'Rejected') {
    const session = await getSession()
    if (!session || session.role !== 'admin') return { error: "Unauthorized" }

    try {
        await db.update(leaveRequests).set({ status }).where(eq(leaveRequests.id, id))
        return { success: true }
    } catch (error) {
        console.error("Error updating leave status:", error)
        return { error: "Failed to update status" }
    }
}