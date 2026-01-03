"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin } from "lucide-react"
import { formatDate, formatTime, getDateDaysAgo } from "@/lib/date-utils"

export default function AttendancePage() {
    const [isCheckedIn, setIsCheckedIn] = useState(false)
    const [logs, setLogs] = useState([
        { date: formatDate(getDateDaysAgo(1)), checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present" },
        { date: formatDate(getDateDaysAgo(2)), checkIn: "09:15 AM", checkOut: "06:10 PM", status: "Present" },
        { date: formatDate(getDateDaysAgo(3)), checkIn: "09:05 AM", checkOut: "05:55 PM", status: "Present" },
    ])

    const handleToggleAttendance = () => {
        if (!isCheckedIn) {
            // Logic for Check In
            setIsCheckedIn(true)
        } else {
            // Logic for Check Out
            setIsCheckedIn(false)
            // Add mock log
            const today = formatDate()
            setLogs([{
                date: today,
                checkIn: "09:00 AM",
                checkOut: formatTime(),
                status: "Present"
            }, ...logs])
        }
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
                    >
                        {isCheckedIn ? "Check Out" : "Check In"}
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
                                <p className="text-2xl font-bold text-green-800">18</p>
                            </div>
                            <div className="rounded-lg bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-700">Absent</p>
                                <p className="text-2xl font-bold text-red-800">1</p>
                            </div>
                            <div className="rounded-lg bg-yellow-50 p-4">
                                <p className="text-sm font-medium text-yellow-700">Late Arrivals</p>
                                <p className="text-2xl font-bold text-yellow-800">2</p>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-4">
                                <p className="text-sm font-medium text-blue-700">Total Hours</p>
                                <p className="text-2xl font-bold text-blue-800">140h</p>
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
                            {logs.map((log, i) => (
                                <tr key={i}>
                                    <td className="py-3 font-medium text-text-main">{log.date}</td>
                                    <td className="py-3 text-text-muted">{log.checkIn}</td>
                                    <td className="py-3 text-text-muted">{log.checkOut}</td>
                                    <td className="py-3">
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                            {log.status}
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
