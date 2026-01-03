import { getSession } from "@/lib/auth"
import EmployeeLeavePanel from "@/components/leave/employee-leave-panel"
import AdminLeavePanel from "@/components/leave/admin-leave-panel"
import { redirect } from "next/navigation"

export default async function LeavePage() {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    const isAdmin = session.role === 'admin'

    return isAdmin ? <AdminLeavePanel /> : <EmployeeLeavePanel />
}
