"use client"

import { useState, useEffect } from "react"
import { getAllSalaries } from "@/actions/payroll"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminPayrollView() {
    const [salaries, setSalaries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            const res = await getAllSalaries()
            setSalaries(res || [])
            setLoading(false)
        }
        fetch()
    }, [])

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-main">Payroll Management</h2>
            <Card>
                <CardHeader><CardTitle>Employee Salaries</CardTitle></CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b">
                                <tr>
                                    <th className="p-4 font-medium text-muted-foreground">Employee</th>
                                    <th className="p-4 font-medium text-muted-foreground">Net Salary (Monthly)</th>
                                    <th className="p-4 font-medium text-muted-foreground">CTC (Annual)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries.map((emp) => (
                                    <tr key={emp.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium">{emp.full_name}</div>
                                            <div className="text-xs text-gray-500">{emp.email}</div>
                                        </td>
                                        <td className="p-4 font-semibold text-primary-coral">
                                            {emp.net_salary ? `₹${Number(emp.net_salary).toLocaleString()}` : '-'}
                                        </td>
                                        <td className="p-4">
                                            {emp.ctc ? `₹${Number(emp.ctc).toLocaleString()}` : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {!loading && salaries.length === 0 && (
                                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">No records found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
