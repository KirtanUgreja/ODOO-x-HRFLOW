"use server"

import { db } from "@/lib/db"
import { users, profiles, attendance, personalInfo, bankingInfo, salaryInfo } from "@/db/schema"
import { eq, desc, and, isNull } from "drizzle-orm"
import { hashPassword, getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

import { employeeSchema } from "@/lib/validators"

export async function createEmployee(prevState: any, formData: FormData) {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
        return { error: "Unauthorized" }
    }

    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
        fullName: formData.get("fullName"),
        role: formData.get("role") || 'employee',
        phone: formData.get("phone"),
        department: formData.get("department") || 'Engineering',
    }

    const validatedFields = employeeSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: validatedFields.error.issues[0].message }
    }

    const { email, password, fullName, role, phone, department } = validatedFields.data

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

        if (!newUser) {
            console.error("Failed to insert user into users table")
            return { error: "Failed to create user record" }
        }

        await db.insert(profiles).values({
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
            department: department
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



export async function getEmployeeDetails(userId: string) {
    const session = await getSession()
    if (!session || session.role !== 'admin') return null

    const [user] = await db.select().from(users).where(eq(users.id, userId))
    if (!user) return null

    const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId))
    const [personal] = await db.select().from(personalInfo).where(eq(personalInfo.user_id, userId))
    const [banking] = await db.select().from(bankingInfo).where(eq(bankingInfo.user_id, userId))
    const [salary] = await db.select().from(salaryInfo).where(eq(salaryInfo.user_id, userId))

    return {
        user,
        profile,
        personal,
        banking,
        salary
    }
}

export async function updateEmployee(prevState: any, formData: FormData) {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
        return { error: "Unauthorized" }
    }

    const userId = formData.get("id") as string

    // Core User/Profile Data
    const email = formData.get("email") as string
    const fullName = formData.get("fullName") as string
    const role = formData.get("role") as string
    const phone = formData.get("phone") as string
    const department = formData.get("department") as string
    const password = formData.get("password") as string

    // Personal Info Data
    const dob = formData.get("dob") as string
    const gender = formData.get("gender") as string
    const address = formData.get("address") as string

    // Banking Info Data
    const bankName = formData.get("bankName") as string
    const accountNumber = formData.get("accountNumber") as string
    const ifsc = formData.get("ifscCode") as string

    // Salary Info Data
    const basicSalary = formData.get("basicSalary") as string
    const hra = formData.get("hra") as string
    const standardAllowance = formData.get("standardAllowance") as string
    const performanceBonus = formData.get("performanceBonus") as string
    const lta = formData.get("lta") as string
    const fixedAllowance = formData.get("fixedAllowance") as string
    const employeePf = formData.get("employeePf") as string
    const employerPf = formData.get("employerPf") as string
    const professionalTax = formData.get("professionalTax") as string
    const grossSalary = formData.get("grossSalary") as string
    const netSalary = formData.get("netSalary") as string
    const ctc = formData.get("ctc") as string

    try {
        const updateData: any = {
            email,
            full_name: fullName,
            role,
            phone
        }

        if (password && password.trim() !== "") {
            updateData.password_hash = await hashPassword(password)
        }

        await db.update(users).set(updateData).where(eq(users.id, userId))

        // Update profile
        await db.update(profiles).set({
            email,
            full_name: fullName,
            department
        }).where(eq(profiles.id, userId))

        // Upsert Personal Info
        await db.insert(personalInfo).values({
            user_id: userId,
            date_of_birth: dob || null,
            gender: gender || null,
            residing_address: address || null
        }).onConflictDoUpdate({
            target: personalInfo.user_id,
            set: {
                date_of_birth: dob || null,
                gender: gender || null,
                residing_address: address || null
            }
        })

        // Upsert Banking Info
        await db.insert(bankingInfo).values({
            user_id: userId,
            bank_name: bankName || null,
            account_number: accountNumber || null,
            ifsc_code: ifsc || null
        }).onConflictDoUpdate({
            target: bankingInfo.user_id,
            set: {
                bank_name: bankName || null,
                account_number: accountNumber || null,
                ifsc_code: ifsc || null
            }
        })

        // Upsert Salary Info
        await db.insert(salaryInfo).values({
            user_id: userId,
            basic_salary: basicSalary || null,
            hra: hra || null,
            standard_allowance: standardAllowance || null,
            performance_bonus: performanceBonus || null,
            lta: lta || null,
            fixed_allowance: fixedAllowance || null,
            employee_pf: employeePf || null,
            employer_pf: employerPf || null,
            professional_tax: professionalTax || null,
            gross_salary: grossSalary || null,
            net_salary: netSalary || null,
            ctc: ctc || null
        }).onConflictDoUpdate({
            target: salaryInfo.user_id,
            set: {
                basic_salary: basicSalary || null,
                hra: hra || null,
                standard_allowance: standardAllowance || null,
                performance_bonus: performanceBonus || null,
                lta: lta || null,
                fixed_allowance: fixedAllowance || null,
                employee_pf: employeePf || null,
                employer_pf: employerPf || null,
                professional_tax: professionalTax || null,
                gross_salary: grossSalary || null,
                net_salary: netSalary || null,
                ctc: ctc || null
            }
        })

        revalidatePath('/employees')
        return { success: "Updated successfully" }
    } catch (error) {
        console.error("Update error", error)
        return { error: "Failed to update" }
    }
}


export async function getPresentEmployees() {
    const session = await getSession()
    if (!session || session.role !== 'admin') return []

    const today = new Date().toISOString().split('T')[0] // Simple YYYY-MM-DD for now

    // Join attendance with users/profiles to get names
    const present = await db.select({
        id: users.id,
        full_name: users.full_name,
        check_in_time: attendance.check_in_time,
        role: users.role,
    })
        .from(attendance)
        .innerJoin(users, eq(attendance.user_id, users.id))
        .where(
            and(
                eq(attendance.date, today),
                isNull(attendance.check_out_time)
            )
        )

    return present
}

export async function getAllAttendance() {
    const session = await getSession()
    if (!session || session.role !== 'admin') return []

    // Get all attendance sorted by date desc
    const logs = await db.select({
        id: attendance.id,
        user_id: users.id,
        full_name: users.full_name,
        date: attendance.date,
        check_in: attendance.check_in_time,
        check_out: attendance.check_out_time,
        status: attendance.status
    })
        .from(attendance)
        .innerJoin(users, eq(attendance.user_id, users.id))
        .orderBy(desc(attendance.date))
        .limit(50) // Limit for performance

    return logs
}
