import { getSession } from "@/lib/auth"
import { AdminLeaveView } from "@/components/dashboard/leave/admin-view"
import { EmployeeLeaveView } from "@/components/dashboard/leave/employee-view"

export default async function LeavePage() {
    const session = await getSession()

    if (session?.role === 'admin') {
        return <AdminLeaveView />
    }

    return <EmployeeLeaveView />
}
