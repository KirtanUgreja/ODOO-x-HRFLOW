import { getEmployees } from "@/actions/admin"
import { EmployeeList } from "@/components/dashboard/employee-list"

export default async function EmployeesPage() {
    const employees = await getEmployees()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-text-main">Employees</h1>
                <p className="text-text-muted">Manage your organization members and their roles.</p>
            </div>
            <EmployeeList initialEmployees={employees} />
        </div>
    )
}
