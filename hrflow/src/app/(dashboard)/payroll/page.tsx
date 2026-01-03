import { getSession } from "@/lib/auth"
import { AdminPayrollView } from "@/components/dashboard/payroll/admin-view"
import { EmployeePayrollView } from "@/components/dashboard/payroll/employee-view"

export default async function PayrollPage() {
    const session = await getSession()

    if (session?.role === 'admin') {
        return <AdminPayrollView />
    }

    return <EmployeePayrollView />
}
