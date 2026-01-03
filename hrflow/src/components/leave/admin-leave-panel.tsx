"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export default function AdminLeavePanel() {
    // Mock data - would fetch from API/Server Action
    const [requests, setRequests] = useState([
        { id: 1, employee: "Alice Johnson", type: "Sick Leave", dates: "12 Oct - 14 Oct", days: 3, reason: "Flu", status: "Pending" },
        { id: 2, employee: "Bob Smith", type: "Casual Leave", dates: "20 Oct", days: 1, reason: "Personal work", status: "Pending" },
        { id: 3, employee: "Charlie Brown", type: "Earned Leave", dates: "01 Nov - 10 Nov", days: 10, reason: "Vacation", status: "Approved" }, // History
    ])

    const handleAction = (id: number, action: 'Approved' | 'Rejected') => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req))
    }

    const pendingRequests = requests.filter(r => r.status === 'Pending')
    const historyRequests = requests.filter(r => r.status !== 'Pending')

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary-coral">Leave Management</h2>

            {/* Pending Approvals */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Pending Approvals</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{pendingRequests.length} Pending</span>
                    </CardTitle>
                    <CardDescription>Review and take action on leave requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">No pending requests.</div>
                    ) : (
                        <div className="space-y-4">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-white shadow-sm gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-text-main">{req.employee}</span>
                                            <span className="text-xs text-text-muted">• {req.type}</span>
                                        </div>
                                        <div className="text-sm text-text-muted mb-1">
                                            {req.dates} ({req.days} days)
                                        </div>
                                        <div className="text-sm text-gray-700 italic">
                                            "{req.reason}"
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 md:flex-none"
                                            onClick={() => handleAction(req.id, 'Rejected')}>
                                            <X className="w-4 h-4 mr-1" /> Reject
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                                            onClick={() => handleAction(req.id, 'Approved')}>
                                            <Check className="w-4 h-4 mr-1" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* History */}
            <Card>
                <CardHeader>
                    <CardTitle>Request History</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-text-muted">
                            <tr>
                                <th className="px-4 py-2">Employee</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Dates</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {historyRequests.map(req => (
                                <tr key={req.id}>
                                    <td className="px-4 py-3 font-medium">{req.employee}</td>
                                    <td className="px-4 py-3 text-text-muted">{req.type}</td>
                                    <td className="px-4 py-3 text-text-muted">{req.dates}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${req.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}
