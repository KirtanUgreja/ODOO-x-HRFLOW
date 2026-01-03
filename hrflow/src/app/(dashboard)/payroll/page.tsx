"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export default function PayrollPage() {
    const salaryData = {
        earnings: [
            { label: "Basic Salary", amount: 25000.00 },
            { label: "House Rent Allowance (HRA)", amount: 12500.00 },
            { label: "Standard Allowance", amount: 4167.00 },
            { label: "Performance Bonus", amount: 2082.50 },
            { label: "Leave Travel Allowance (LTA)", amount: 2082.50 },
            { label: "Fixed Allowance", amount: 2918.00 },
        ],
        deductions: [
            { label: "Provident Fund (Employee)", amount: 3000.00 },
            { label: "Professional Tax", amount: 200.00 },
            { label: "Tax Deducted at Source (TDS)", amount: 0.00 },
        ]
    }

    const totalEarnings = 48750.00
    const totalDeductions = 3200.00
    const netSalary = 45550.00

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
                        <p className="text-sm font-medium text-text-muted mb-1">Net Pay (January)</p>
                        <h3 className="text-4xl font-bold text-primary-coral">₹{netSalary.toLocaleString()}</h3>
                        <p className="text-xs text-text-muted mt-2">Paid on Jan 31, 2026</p>
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
                            <p className="text-xl font-bold">****7890</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">CTC (Annual)</p>
                            <p className="text-xl font-bold">₹6,36,000</p>
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
                        {/* Earnings */}
                        <div>
                            <h4 className="mb-4 text-sm font-semibold uppercase text-green-600">Earnings</h4>
                            <div className="space-y-3">
                                {salaryData.earnings.map((item, i) => (
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
                                {salaryData.deductions.map((item, i) => (
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
