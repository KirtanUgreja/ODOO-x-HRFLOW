"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin } from "lucide-react"
import { formatDate, formatTime, getDateDaysAgo } from "@/lib/date-utils"
import { getAttendanceData, checkInOut, getTodayAttendance } from "@/actions/attendance"

export function EmployeeAttendanceView() {
    const [attendanceData, setAttendanceData] = useState<any>(null)
    const [todayRecord, setTodayRecord] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    const fetchData = async () => {
        const [data, today] = await Promise.all([
            getAttendanceData(),
            getTodayAttendance()
        ])
        if (data) setAttendanceData(data)
        if (today) setTodayRecord(today)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const isCheckedIn = todayRecord && todayRecord.check_in_time && !todayRecord.check_out_time

    const handleToggleAttendance = async () => {
        setActionLoading(true)
        const action = isCheckedIn ? 'checkout' : 'checkin'
        const result = await checkInOut(action)

        if (result.success) {
            await fetchData() // Refresh data
        } else {
            alert(result.error || 'Failed to update attendance')
        }
        setActionLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Attendance Action */}
                <Card className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="mb-6 rounded-full bg-white p-6 shadow-soft">
                        <Clock className="h-16 w-16 text-primary-coral" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-text-main">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </h2>
                    <p className="mb-8 text-text-muted">{new Date().toDateString()}</p>
                    <Button
                        size="lg"
                        className={`w-48 text-lg ${isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                        onClick={handleToggleAttendance}
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Processing...' : (isCheckedIn ? "Check Out" : "Check In")}
                    </Button>
                    <p className="mt-4 flex items-center gap-2 text-sm text-text-muted">
                        <MapPin className="h-4 w-4" /> Office Location (Detected)
                    </p>
                </Card>

                {/* Stats */}
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle>Monthly Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-green-50 p-4">
                                <p className="text-sm font-medium text-green-700">Days Present</p>
                                <p className="text-2xl font-bold text-green-800">{attendanceData?.monthlyStats?.present || 0}</p>
                            </div>
                            <div className="rounded-lg bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-700">Absent</p>
                                <p className="text-2xl font-bold text-red-800">{attendanceData?.monthlyStats?.absent || 0}</p>
                            </div>
                            <div className="rounded-lg bg-yellow-50 p-4">
                                <p className="text-sm font-medium text-yellow-700">Late Arrivals</p>
                                <p className="text-2xl font-bold text-yellow-800">{attendanceData?.monthlyStats?.late || 0}</p>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-4">
                                <p className="text-sm font-medium text-blue-700">Total Hours</p>
                                <p className="text-2xl font-bold text-blue-800">{Math.round(attendanceData?.monthlyStats?.totalHours || 0)}h</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* History */}
            <Card>
                <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b text-text-muted">
                                <th className="pb-3 font-medium">Date</th>
                                <th className="pb-3 font-medium">Check In</th>
                                <th className="pb-3 font-medium">Check Out</th>
                                <th className="pb-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {attendanceData?.recentAttendance?.map((log: any, i: number) => (
                                <tr key={i}>
                                    <td className="py-3 font-medium text-text-main">{formatDate(log.date)}</td>
                                    <td className="py-3 text-text-muted">{log.check_in_time || 'N/A'}</td>
                                    <td className="py-3 text-text-muted">{log.check_out_time || 'N/A'}</td>
                                    <td className="py-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${log.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                log.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            )) || [
                                    <tr key="no-data">
                                        <td colSpan={4} className="py-6 text-center text-text-muted">
                                            No attendance records found
                                        </td>
                                    </tr>
                                ]}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}
