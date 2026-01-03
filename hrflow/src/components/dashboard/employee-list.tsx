"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Trash2, Edit2, Key, X } from "lucide-react"
import { createEmployee, deleteEmployee, updateEmployee } from "@/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Employee {
    id: string
    full_name: string | null
    email: string
    role: string
    phone: string | null
    created_at: Date | null
}

export function EmployeeList({ initialEmployees }: { initialEmployees: Employee[] }) {
    const [employees, setEmployees] = useState(initialEmployees)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
    const router = useRouter()

    const filteredEmployees = employees.filter(emp =>
        emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    async function handleCreate(formData: FormData) {
        setIsLoading(true)
        const res = await createEmployee(null, formData)
        setIsLoading(false)
        if (res?.success) {
            setIsAddModalOpen(false)
            router.refresh()
            // Optimistically update or wait for refresh? Refresh is safer.
        } else {
            alert(res?.error || "Failed to create")
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return
        const res = await deleteEmployee(id)
        if (res?.success) {
            router.refresh()
            setEmployees(employees.filter(e => e.id !== id))
        }
    }

    async function handleEdit(formData: FormData) {
        setIsLoading(true)
        const res = await updateEmployee(null, formData)
        setIsLoading(false)
        if (res?.success) {
            setIsEditModalOpen(false)
            setSelectedEmployee(null)
            router.refresh()
        } else {
            alert(res?.error || "Failed to update")
        }
    }

    // ... existing handleDelete ...

    return (
        <div className="space-y-4">
            {/* ... Search and Add Button ... */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search employees..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary-coral hover:bg-primary-coral/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        {/* ... thead ... */}
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-gray-900">Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-gray-900">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-gray-900">Role</th>
                                <th className="h-12 px-4 align-middle font-medium text-gray-900">Joined</th>
                                <th className="h-12 px-4 align-middle font-medium text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium text-gray-900">{employee.full_name}</td>
                                    <td className="p-4 align-middle text-gray-900">{employee.email}</td>
                                    <td className="p-4 align-middle capitalize">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${employee.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {employee.role}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-gray-900">
                                        {employee.created_at ? new Date(employee.created_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => {
                                                setSelectedEmployee(employee)
                                                setIsEditModalOpen(true)
                                            }}>
                                                <Edit2 className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-lg shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Add New Employee</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form action={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input name="fullName" required placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input name="phone" placeholder="+1234567890" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="email" type="email" required placeholder="john@company.com" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Role</label>
                                        <select name="role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="employee">Employee</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Department</label>
                                        <select name="department" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="Engineering">Engineering</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Sales">Sales</option>
                                            <option value="HR">HR</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Design">Design</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input name="password" type="password" required />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-900 border-gray-300 hover:bg-gray-100">Cancel</Button>
                                    <Button type="submit" disabled={isLoading} className="bg-primary-coral">
                                        {isLoading ? "Creating..." : "Create Employee"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-lg shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Employee</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form action={handleEdit} className="space-y-4">
                                <input type="hidden" name="id" value={selectedEmployee.id} />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input name="fullName" defaultValue={selectedEmployee.full_name || ''} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input name="phone" defaultValue={selectedEmployee.phone || ''} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="email" type="email" defaultValue={selectedEmployee.email} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Role</label>
                                        <select name="role" defaultValue={selectedEmployee.role} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="employee">Employee</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Department</label>
                                        {/* Ideally fetch real department if available in selectedEmployee, defaulting to Engineering for now as field isn't in Employee interface yet */}
                                        <select name="department" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="Engineering">Engineering</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Sales">Sales</option>
                                            <option value="HR">HR</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Design">Design</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">New Password <span className="text-xs text-muted-foreground font-normal">(Leave blank to keep current)</span></label>
                                    <Input name="password" type="password" placeholder="Min 6 characters" />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)} className="text-gray-900 border-gray-300 hover:bg-gray-100">Cancel</Button>
                                    <Button type="submit" disabled={isLoading} className="bg-primary-coral">
                                        {isLoading ? "Save Changes" : "Update Employee"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
