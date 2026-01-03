"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { useEffect, useState } from "react"
import { getSalaryData } from "@/actions/payroll"

export default function PayrollPage() {
    const [salaryData, setSalaryData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const data = await getSalaryData()
            if (data) setSalaryData(data)
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>
    }

    const salary = salaryData?.salary
    const banking = salaryData?.banking

    // Calculate totals
    const earnings = [
        { label: "Basic Salary", amount: Number(salary?.basic_salary || 0) },
        { label: "House Rent Allowance (HRA)", amount: Number(salary?.hra || 0) },
        { label: "Standard Allowance", amount: Number(salary?.standard_allowance || 0) },
        { label: "Performance Bonus", amount: Number(salary?.performance_bonus || 0) },
        { label: "Leave Travel Allowance (LTA)", amount: Number(salary?.lta || 0) },
        { label: "Fixed Allowance", amount: Number(salary?.fixed_allowance || 0) },
    ]

    const deductions = [
        { label: "Provident Fund (Employee)", amount: Number(salary?.employee_pf || 0) },
        { label: "Professional Tax", amount: Number(salary?.professional_tax || 0) },
        { label: "Tax Deducted at Source (TDS)", amount: 0 },
    ]

    const totalEarnings = Number(salary?.gross_salary || 0)
    const totalDeductions = Number(salary?.employee_pf || 0) + Number(salary?.professional_tax || 0)
    const netSalary = Number(salary?.net_salary || 0)
    const ctc = Number(salary?.ctc || 0)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-main">My Payroll</h2>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Download Salary Slip
                </Button>
            </div>

            {/* Salary Overview Card */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-primary-coral/10 border-primary-coral/20 border col-span-1">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-sm font-medium text-text-muted mb-1">Net Pay (Current Month)</p>
                        <h3 className="text-4xl font-bold text-primary-coral">₹{netSalary.toLocaleString()}</h3>
                        <p className="text-xs text-text-muted mt-2">Last updated: {salary?.updated_at ? new Date(salary.updated_at).toLocaleDateString() : 'N/A'}</p>
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardContent className="p-6 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-text-muted">Days Payable</p>
                            <p className="text-xl font-bold">31</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Account</p>
                            <p className="text-xl font-bold">{banking?.account_number ? `****${banking.account_number.slice(-4)}` : 'Not Set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">CTC (Annual)</p>
                            <p className="text-xl font-bold">₹{ctc.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Gross Earnings</p>
                            <p className="text-xl font-bold">₹{totalEarnings.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Salary Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="mb-4 text-sm font-semibold uppercase text-green-600">Earnings</h4>
                            <div className="space-y-3">
                                {earnings.map((item, i) => (
                                    <div key={i} className="flex justify-between border-b border-gray-100 pb-2 text-sm">
                                        <span className="text-text-main">{item.label}</span>
                                        <span className="font-medium text-text-main">₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold pt-2">
                                    <span>Total Earnings</span>
                                    <span>₹{totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Deductions */}
                        <div>
                            <h4 className="mb-4 text-sm font-semibold uppercase text-red-600">Deductions</h4>
                            <div className="space-y-3">
                                {deductions.map((item, i) => (
                                    <div key={i} className="flex justify-between border-b border-gray-100 pb-2 text-sm">
                                        <span className="text-text-main">{item.label}</span>
                                        <span className="font-medium text-text-main">₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold pt-2">
                                    <span>Total Deductions</span>
                                    <span>₹{totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
