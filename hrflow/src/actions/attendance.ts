"use server"

import { db } from "@/lib/db"
import { attendance, users } from "@/db/schema"
import { eq, desc, and, gte, lte, sql } from "drizzle-orm"
import { getSession } from "@/lib/auth"

export async function getAttendanceData() {
    const session = await getSession()
    if (!session) return null

    try {
        // Get recent attendance records
        const recentAttendance = await db.select()
            .from(attendance)
            .where(eq(attendance.user_id, session.userId))
            .orderBy(desc(attendance.date))
            .limit(10)

        // Get monthly stats
        const currentMonth = new Date()
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

        const monthlyStats = await db.select({
            total: sql<number>`count(*)`,
            present: sql<number>`count(case when status = 'Present' then 1 end)`,
            absent: sql<number>`count(case when status = 'Absent' then 1 end)`,
            late: sql<number>`count(case when status = 'Late' then 1 end)`,
            totalHours: sql<number>`sum(extract(epoch from (check_out_time - check_in_time))/3600)`
        })
            .from(attendance)
            .where(and(
                eq(attendance.user_id, session.userId),
                gte(attendance.date, firstDay.toISOString().split('T')[0]),
                lte(attendance.date, lastDay.toISOString().split('T')[0])
            ))

        return {
            recentAttendance,
            monthlyStats: monthlyStats[0] || { total: 0, present: 0, absent: 0, late: 0, totalHours: 0 }
        }
    } catch (error) {
        console.error("Error fetching attendance data:", error)
        return null
    }
}

export async function checkInOut(action: 'checkin' | 'checkout') {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    try {
        const today = new Date().toISOString().split('T')[0]
        const currentTime = new Date().toTimeString().split(' ')[0]

        if (action === 'checkin') {
            await db.insert(attendance).values({
                user_id: session.userId,
                date: today,
                check_in_time: currentTime,
                status: 'Present'
            })
        } else {
            // Find the latest check-in without checkout
            const [latestSession] = await db.select()
                .from(attendance)
                .where(and(
                    eq(attendance.user_id, session.userId),
                    eq(attendance.date, today),
                    sql`check_out_time IS NULL`
                ))
                .orderBy(desc(attendance.created_at))
                .limit(1)

            if (!latestSession) {
                return { error: "No active session to check out" }
            }

            await db.update(attendance)
                .set({ check_out_time: currentTime })
                .where(eq(attendance.id, latestSession.id))
        }

        return { success: true }
    } catch (error) {
        console.error("Error with check in/out:", error)
        return { error: "Failed to update attendance" }
    }
}

export async function getTodayAttendance() {
    const session = await getSession()
    if (!session) return null

    try {
        const today = new Date().toISOString().split('T')[0]

        // Get latest session to determine current status
        const [latestSession] = await db.select()
            .from(attendance)
            .where(and(
                eq(attendance.user_id, session.userId),
                eq(attendance.date, today)
            ))
            .orderBy(desc(attendance.created_at))
            .limit(1)

        return latestSession
    } catch (error) {
        console.error("Error fetching today's attendance:", error)
        return null
    }
}


export async function getAllAttendance(date: string = new Date().toISOString().split('T')[0]) {
    const session = await getSession()
    if (!session || session.role !== 'admin') return []

    try {
        const records = await db.select({
            id: attendance.id,
            user_id: attendance.user_id,
            date: attendance.date,
            check_in_time: attendance.check_in_time,
            check_out_time: attendance.check_out_time,
            status: attendance.status,
            full_name: users.full_name,
            email: users.email
        })
            .from(attendance)
            .innerJoin(users, eq(attendance.user_id, users.id))
            .where(eq(attendance.date, date))
            .orderBy(desc(attendance.check_in_time))

        return records
    } catch (error) {
        console.error("Error fetching all attendance:", error)
        return []
    }
}