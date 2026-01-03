"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createEmployee, deleteEmployee } from "@/actions/admin"
import { Plus, Pencil, Trash, X } from "lucide-react"

export default function EmployeesClient({ employees: initialEmployees }: { employees: any[] }) {
    const [employees, setEmployees] = useState(initialEmployees)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState("")

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this employee?")) return;
        setIsDeleting(id)

        const res = await deleteEmployee(id)
        if (res.success) {
            // Optimistic update or wait for revalidate
            // Since we use revalidatePath in action, server re-renders, but this is client state.
            // Actually server revalidate works on next navigation/refresh.
            // For immediate feedback, we can filter locally.
            setEmployees(prev => prev.filter(e => e.id !== id))
        } else {
            alert(res.error)
        }
        setIsDeleting("")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-primary-coral">
                        Employees
                    </h2>
                    <p className="mt-1 text-text-muted">
                        Manage your team members and their roles.
                    </p>
                </div>
                <Button variant="action" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 uppercase text-text-muted">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Department</th>
                                <th className="px-6 py-4 font-medium">Role/Designation</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                                        No employees found. Click "Add Employee" to create one.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary-coral/10 text-primary-coral flex items-center justify-center font-bold text-xs">
                                                    {employee.fullName?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-text-main">{employee.fullName}</div>
                                                    <div className="text-xs text-text-muted">{employee.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-text-muted">
                                            {employee.department || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                {employee.designation || employee.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-muted">
                                            {employee.phone || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Edit not fully implemented in UI yet, placeholder */}
                                                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    disabled={isDeleting === employee.id}
                                                    className="text-gray-400 hover:text-red-600 transition-colors">
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create Employee Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                    <Card className="w-full max-w-md relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </button>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-4">Add New Employee</h3>
                            <form action={createEmployee} onSubmit={() => setTimeout(() => {
                                // Simple reload/fetch or wait for action
                                // Ideally useActionState but for speed standard submit
                                setIsCreateModalOpen(false)
                                // We rely on server revalidate + maybe router refresh if we were using it
                                // For now, we might need to manually refresh or add the new item to state if we want instant feedback
                                // without full reload. 
                                // Proper way: use useActionState return value.
                            }, 500)}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date Joined (Implied Today)</label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Full Name</label>
                                            <Input name="fullName" required placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Phone</label>
                                            <Input name="phone" placeholder="+1 234..." />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input name="email" type="email" required placeholder="john@company.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Password</label>
                                        <Input name="password" type="password" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Department</label>
                                            <Input name="department" placeholder="Engineering" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Role / Title</label>
                                            <Input name="designation" placeholder="Software Engineer" />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="action" className="flex-1">
                                            Create Employee
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
