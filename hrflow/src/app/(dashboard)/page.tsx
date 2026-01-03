
"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, FileText, CheckCircle, LogIn, LogOut } from "lucide-react"
import { getProfile } from "@/actions/profile"
import { getAttendanceData, checkInOut, getTodayAttendance } from "@/actions/attendance"
import { getLeaveData } from "@/actions/leave"
import { useEffect, useState } from "react"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { formatDate, getDateDaysAgo } from "@/lib/date-utils"

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null)
    const [attendanceData, setAttendanceData] = useState<any>(null)
    const [leaveData, setLeaveData] = useState<any>(null)
    const [todayAttendance, setTodayAttendance] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const [profileData, attendance, leaves, todayData] = await Promise.all([
                getProfile(),
                getAttendanceData(),
                getLeaveData(),
                getTodayAttendance()
            ])
            
            if (profileData) setProfile(profileData)
            if (attendance) setAttendanceData(attendance)
            if (leaves) setLeaveData(leaves)
            if (todayData) setTodayAttendance(todayData)
            setLoading(false)
        }
        fetchData()
    }, [])

    const handleCheckInOut = async (action: 'checkin' | 'checkout') => {
        setActionLoading(true)
        try {
            const result = await checkInOut(action)
            if (result.success) {
                // Refresh today's attendance data
                const todayData = await getTodayAttendance()
                setTodayAttendance(todayData)
            } else {
                alert(result.error || 'Failed to update attendance')
            }
        } catch (error) {
            alert('An error occurred')
        } finally {
            setActionLoading(false)
        }
    }

    const isCheckedIn = todayAttendance && !todayAttendance.check_out_time

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
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            <Button 
                                onClick={() => handleCheckInOut('checkin')}
                                disabled={actionLoading || isCheckedIn}
                                variant="action"
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                Check In
                            </Button>
                            <Button 
                                onClick={() => handleCheckInOut('checkout')}
                                disabled={actionLoading || !isCheckedIn}
                                variant="action"
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Check Out
                            </Button>
                        </div>
                        <div className="flex gap-4">
                            <KPI_Card 
                                icon={Clock} 
                                label="Avg. Work Hrs" 
                                value={attendanceData?.monthlyStats?.totalHours ? `${Math.round(attendanceData.monthlyStats.totalHours)}h` : "0h"} 
                            />
                            <KPI_Card 
                                icon={CheckCircle} 
                                label="On Time" 
                                value={attendanceData?.monthlyStats?.present && attendanceData?.monthlyStats?.total ? 
                                    `${Math.round((attendanceData.monthlyStats.present / attendanceData.monthlyStats.total) * 100)}%` : "0%"} 
                            />
                        </div>
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
                            {leaveData?.leaves?.slice(0, 3).map((leave: any, i: number) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">
                                        {new Date(leave.start_date).getDate()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-main">{leave.leave_type}</p>
                                        <p className="text-xs text-text-muted">{leave.status} - {leave.days} day(s)</p>
                                    </div>
                                </div>
                            )) || [
                                <div key="no-data" className="text-center text-text-muted py-4">
                                    No upcoming events
                                </div>
                            ]}
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
                                {leaveData?.leaves?.slice(0, 5).map((leave: any, i: number) => (
                                    <tr key={i}>
                                        <td className="py-3 font-medium text-text-main">{leave.leave_type}</td>
                                        <td className="py-3 text-text-muted">{formatDate(leave.start_date)}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-text-muted">{leave.days} Day(s)</td>
                                    </tr>
                                )) || [
                                    <tr key="no-data">
                                        <td colSpan={4} className="py-6 text-center text-text-muted">
                                            No leave requests found
                                        </td>
                                    </tr>
                                ]}
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
