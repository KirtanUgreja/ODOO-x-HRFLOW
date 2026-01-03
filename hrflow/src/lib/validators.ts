import { z } from "zod"

export const employeeSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    role: z.enum(["admin", "employee"]).default("employee"),
    phone: z.string().optional(),
    department: z.string().default("Engineering"),
})

export const updateEmployeeSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    fullName: z.string().min(2),
    role: z.string(),
    phone: z.string().optional(),
    department: z.string().optional(),
    password: z.string().optional(), // empty string check needed manually or refined here

    // Personal
    dob: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),

    // Banking
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().optional(),

    // Salary
    ctc: z.string().optional(),
    basicSalary: z.string().optional(),
    hra: z.string().optional(),
    standardAllowance: z.string().optional(),
    performanceBonus: z.string().optional(),
    lta: z.string().optional(),
    fixedAllowance: z.string().optional(),
    employeePf: z.string().optional(),
    employerPf: z.string().optional(),
    professionalTax: z.string().optional(),
    grossSalary: z.string().optional(),
    netSalary: z.string().optional(),
})
