"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function LeavePage() {
    const [leaves, setLeaves] = useState([
        { type: "Sick Leave", startDate: "Jan 12, 2026", endDate: "Jan 13, 2026", days: 2, status: "Approved", reason: "Viral fever" },
        { type: "Casual Leave", startDate: "Dec 24, 2025", endDate: "Dec 25, 2025", days: 2, status: "Rejected", reason: "Holiday trip" },
    ])

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                {/* Application Form */}
                <Card className="col-span-1 border-primary-coral/20 border-l-4">
                    <CardHeader>
                        <CardTitle>Apply for Leave</CardTitle>
                        <CardDescription>Request time off</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Leave Type</label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Earned Leave</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">From</label>
                                    <Input type="date" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">To</label>
                                    <Input type="date" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reason</label>
                                <Input placeholder="Enter reason..." />
                            </div>
                            <Button type="submit" variant="action" className="w-full">
                                Submit Request
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Leave Balances */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Your Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 grid grid-cols-3 gap-4">
                            <div className="rounded-lg bg-blue-50 p-4 text-center">
                                <p className="text-sm text-text-muted">Total Leaves</p>
                                <p className="text-2xl font-bold text-blue-600">24</p>
                            </div>
                            <div className="rounded-lg bg-green-50 p-4 text-center">
                                <p className="text-sm text-text-muted">Available</p>
                                <p className="text-2xl font-bold text-green-600">22</p>
                            </div>
                            <div className="rounded-lg bg-yellow-50 p-4 text-center">
                                <p className="text-sm text-text-muted">Used</p>
                                <p className="text-2xl font-bold text-yellow-600">2</p>
                            </div>
                        </div>

                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b text-text-muted">
                                    <th className="pb-3 font-medium">Type</th>
                                    <th className="pb-3 font-medium">Dates</th>
                                    <th className="pb-3 font-medium">Days</th>
                                    <th className="pb-3 font-medium">Reason</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {leaves.map((leave, i) => (
                                    <tr key={i}>
                                        <td className="py-3 font-medium text-text-main">{leave.type}</td>
                                        <td className="py-3 text-text-muted">{leave.startDate} - {leave.endDate}</td>
                                        <td className="py-3 text-text-muted">{leave.days}</td>
                                        <td className="py-3 text-text-muted max-w-xs truncate">{leave.reason}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
