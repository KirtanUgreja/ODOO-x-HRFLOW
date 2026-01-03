import { getSession } from "@/lib/auth"
import EmployeeLeavePanel from "@/components/leave/employee-leave-panel"
import AdminLeavePanel from "@/components/leave/admin-leave-panel"
import { redirect } from "next/navigation"

export default async function LeavePage() {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    const isAdmin = session.role === 'admin'

    return isAdmin ? <AdminLeavePanel /> : <EmployeeLeavePanel />
=======
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { formatDate, getDateDaysAgo } from "@/lib/date-utils"
import { getLeaveData, submitLeaveRequest } from "@/actions/leave"

export default function LeavePage() {
    const [leaveData, setLeaveData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        leave_type: 'Sick Leave',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        reason: ''
    })

    const fetchData = async () => {
        const data = await getLeaveData()
        if (data) setLeaveData(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        
        const result = await submitLeaveRequest(formData)
        if (result.success) {
            setFormData({
                leave_type: 'Sick Leave',
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
                reason: ''
            })
            await fetchData() // Refresh data
            alert('Leave request submitted successfully!')
        } else {
            alert(result.error || 'Failed to submit leave request')
        }
        setSubmitting(false)
    }

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
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Leave Type</label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-coral focus-visible:border-primary-coral"
                                    value={formData.leave_type}
                                    onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
                                >
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Earned Leave</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">From</label>
                                    <Input 
                                        type="date" 
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">To</label>
                                    <Input 
                                        type="date" 
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reason</label>
                                <Input 
                                    placeholder="Enter reason..." 
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    required
                                />
                            </div>
                            <Button type="submit" variant="action" className="w-full" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Request'}
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
                                <p className="text-2xl font-bold text-blue-600">{leaveData?.balance?.total || 0}</p>
                            </div>
                            <div className="rounded-lg bg-green-50 p-4 text-center">
                                <p className="text-sm text-text-muted">Available</p>
                                <p className="text-2xl font-bold text-green-600">{leaveData?.balance?.available || 0}</p>
                            </div>
                            <div className="rounded-lg bg-yellow-50 p-4 text-center">
                                <p className="text-sm text-text-muted">Used</p>
                                <p className="text-2xl font-bold text-yellow-600">{leaveData?.balance?.used || 0}</p>
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
                                {leaveData?.leaves?.map((leave: any, i: number) => (
                                    <tr key={i}>
                                        <td className="py-3 font-medium text-text-main">{leave.leave_type}</td>
                                        <td className="py-3 text-text-muted">{formatDate(leave.start_date)} - {formatDate(leave.end_date)}</td>
                                        <td className="py-3 text-text-muted">{leave.days}</td>
                                        <td className="py-3 text-text-muted max-w-xs truncate">{leave.reason}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) || [
                                    <tr key="no-data">
                                        <td colSpan={5} className="py-6 text-center text-text-muted">
                                            No leave requests found
                                        </td>
                                    </tr>
                                ]}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )

}
