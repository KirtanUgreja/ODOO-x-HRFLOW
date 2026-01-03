
"use client"

import { Card } from "@/components/ui/card"
import { Clock, Calendar, FileText, CheckCircle } from "lucide-react"
import { getProfile } from "@/actions/profile"
import { useEffect, useState } from "react"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { formatDate, getDateDaysAgo } from "@/lib/date-utils"

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const data = await getProfile()
            if (data) setProfile(data)
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div className="space-y-8">
            {/* Hero Banner */}
            <div className="rounded-lg bg-blue-100 p-8 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-primary-coral">
                            Welcome back, {profile?.full_name || "Employee"}!
                        </h2>
                        <p className="mt-2 text-text-muted">
                            Here's what's happening with you today.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <KPI_Card icon={Clock} label="Avg. Work Hrs" value="8h 42m" />
                        <KPI_Card icon={CheckCircle} label="On Time" value="95%" />
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Attendance Status */}
                <Card className="col-span-2">
                    <div className="p-6">
                        <h3 className="mb-4 text-xl font-semibold text-text-main">
                            Attendance Overview
                        </h3>
                        {/* Placeholder for Graph */}
                        <div className="flex h-64 w-full items-center justify-center">
                            <AttendanceChart />
                        </div>
                    </div>
                </Card>

                {/* Mini Calendar / Schedule */}
                <Card className="col-span-1">
                    <div className="p-6">
                        <h3 className="mb-4 text-xl font-semibold text-text-main">
                            Schedule
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">
                                        {10 + i}
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-main">Team Meeting</p>
                                        <p className="text-xs text-text-muted">10:00 AM - 11:00 AM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Leave Requests */}
            <Card>
                <div className="p-6">
                    <h3 className="mb-4 text-xl font-semibold text-text-main">
                        Recent Leave Requests
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b text-text-muted">
                                    <th className="pb-3 font-medium">Type</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Days</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {[
                                    { type: "Sick Leave", date: formatDate(getDateDaysAgo(5)), status: "Approved", days: 1 },
                                    { type: "Casual Leave", date: formatDate(getDateDaysAgo(2)), status: "Pending", days: 2 },
                                ].map((leave, i) => (
                                    <tr key={i}>
                                        <td className="py-3 font-medium text-text-main">{leave.type}</td>
                                        <td className="py-3 text-text-muted">{leave.date}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-text-muted">{leave.days} Day(s)</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    )
}

function KPI_Card({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-sm w-32">
            <Icon className="mb-2 h-6 w-6 text-primary-coral" />
            <span className="text-xs font-medium text-text-muted">{label}</span>
            <span className="text-lg font-bold text-text-main">{value}</span>
        </div>
    )
}
