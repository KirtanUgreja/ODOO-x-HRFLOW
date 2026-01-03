import { getSession } from "@/lib/auth"
import { AdminAttendanceView } from "@/components/dashboard/attendance/admin-view"
import { EmployeeAttendanceView } from "@/components/dashboard/attendance/employee-view"

export default async function AttendancePage() {
    const session = await getSession()

    if (session?.role === 'admin') {
        return <AdminAttendanceView />
    }

    return <EmployeeAttendanceView />
}
