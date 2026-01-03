import { getSession } from "@/lib/auth"
import EmployeeDashboard from "@/components/dashboard/employee-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    const isAdmin = session.role === 'admin'

    return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />
}
