"use server"

import { db } from "@/lib/db"
import { users, leaveRequests, attendance, profiles } from "@/db/schema"
import { eq, count, sql, and } from "drizzle-orm"
import { getSession } from "@/lib/auth"

export async function getAdminStats() {
    const session = await getSession()
    if (!session || session.role !== 'admin') return null

    try {
        // Total Employees
        const [empCount] = await db.select({ value: count() }).from(users).where(eq(users.role, 'employee'))

        // Pending Leave Requests
        const [leaveCount] = await db.select({ value: count() }).from(leaveRequests).where(eq(leaveRequests.status, 'Pending'))

        // Today's Attendance (Present)
        const today = new Date().toISOString().split('T')[0]
        const [presentCount] = await db.select({ value: count() })
            .from(attendance)
            .where(and(
                eq(attendance.date, today),
                eq(attendance.status, 'Present')
            ))

        // Average Attendance (percentage of total employees present today - simpler metric for now)
        const totalEmps = empCount.value || 1
        const attendanceRate = Math.round((presentCount.value / totalEmps) * 100)

        // Department Distribution
        const deptStats = await db.select({
            name: profiles.department,
            employees: count(users.id)
        })
            .from(profiles)
            .innerJoin(users, eq(profiles.id, users.id))
            .where(eq(users.role, 'employee'))
            .groupBy(profiles.department)

        const validDeptStats = deptStats.map(d => ({
            name: d.name || 'Unassigned',
            employees: d.employees
        }))

        return {
            totalEmployees: empCount.value,
            pendingLeaves: leaveCount.value,
            presentToday: presentCount.value,
            attendanceRate: attendanceRate,
            departmentStats: validDeptStats
        }
    } catch (error) {
        console.error("Error fetching admin stats:", error)
        return null
    }
}
