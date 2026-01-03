"use client"

import { useState, useEffect } from "react"
import { getAllLeaveRequests, updateLeaveStatus } from "@/actions/leave"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export function AdminLeaveView() {
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
    const [rejectComment, setRejectComment] = useState("")

    const fetch = async () => {
        setLoading(true)
        const res = await getAllLeaveRequests()
        setRequests(res || [])
        setLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [])

    const handleUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
        if (status === 'Rejected') {
            setSelectedRequestId(id)
            setRejectModalOpen(true)
            return
        }

        const res = await updateLeaveStatus(id, status)
        if (res?.success) {
            fetch()
        } else {
            alert('Failed to update status')
        }
    }

    const confirmReject = async () => {
        if (!selectedRequestId) return

        const res = await updateLeaveStatus(selectedRequestId, 'Rejected', rejectComment)
        if (res?.success) {
            setRejectModalOpen(false)
            setRejectComment("")
            setSelectedRequestId(null)
            fetch()
        } else {
            alert('Failed to reject request')
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-main">Leave Approvals</h2>
            <Card>
                <CardHeader><CardTitle>Request History</CardTitle></CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b">
                                <tr>
                                    <th className="p-4 font-medium text-muted-foreground">Employee</th>
                                    <th className="p-4 font-medium text-muted-foreground">Type</th>
                                    <th className="p-4 font-medium text-muted-foreground">Dates</th>
                                    <th className="p-4 font-medium text-muted-foreground">Reason</th>
                                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                                    <th className="p-4 font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium">{req.full_name}</div>
                                            <div className="text-xs text-gray-500">{req.email}</div>
                                        </td>
                                        <td className="p-4">{req.leave_type}</td>
                                        <td className="p-4">
                                            {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                                            <div className="text-xs text-gray-500">{req.days} days</div>
                                        </td>
                                        <td className="p-4 max-w-xs truncate">{req.reason}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium w-fit ${req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                                {req.admin_comment && (
                                                    <span className="text-xs text-muted-foreground italic truncate max-w-[150px]" title={req.admin_comment}>
                                                        Note: {req.admin_comment}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {req.status === 'Pending' && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" onClick={() => handleUpdate(req.id, 'Approved')}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => handleUpdate(req.id, 'Rejected')}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {!loading && requests.length === 0 && (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No leave requests found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Rejection Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Reject Request</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setRejectModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reason for Rejection</label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                    placeholder="Please provide a reason..."
                                    value={rejectComment}
                                    onChange={(e) => setRejectComment(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-2 text-white">
                                <Button variant="outline" onClick={() => setRejectModalOpen(false)} className="text-black hover:bg-gray-100">Cancel</Button>
                                <Button variant="destructive" onClick={confirmReject}>Confirm Rejection</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
