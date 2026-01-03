import { getEmployees } from "@/actions/admin"
import EmployeesClient from "@/components/employees/employees-client"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function EmployeesPage() {
    const session = await getSession()

    // Protect Admin route
    if (!session || session.role !== 'admin') {
        redirect("/")
    }

    const employees = await getEmployees()

    return <EmployeesClient employees={employees} />
}
