"use server"

import { db } from "@/lib/db"
import { salaryInfo, bankingInfo } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getSession } from "@/lib/auth"

export async function getSalaryData() {
    const session = await getSession()
    if (!session) return null

    try {
        // Get user's salary information
        const [salary] = await db.select()
            .from(salaryInfo)
            .where(eq(salaryInfo.user_id, session.userId))

        // Get banking info for account display
        const [banking] = await db.select()
            .from(bankingInfo)
            .where(eq(bankingInfo.user_id, session.userId))

        if (!salary) {
            // Return default/empty salary structure if no data exists
            return {
                salary: {
                    basic_salary: "0",
                    hra: "0",
                    standard_allowance: "0",
                    performance_bonus: "0",
                    lta: "0",
                    fixed_allowance: "0",
                    employee_pf: "0",
                    professional_tax: "0",
                    gross_salary: "0",
                    net_salary: "0",
                    ctc: "0"
                },
                banking: null
            }
        }

        return {
            salary,
            banking
        }
    } catch (error) {
        console.error("Error fetching salary data:", error)
        return null
    }
}