"use client"

import { useState, useEffect } from "react"
import { getAllAttendance } from "@/actions/attendance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function AdminAttendanceView() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            const res = await getAllAttendance(date)
            setData(res || [])
            setLoading(false)
        }
        fetch()
    }, [date])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-main">Attendance Log</h2>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-48"
                />
            </div>
            <Card>
                <CardHeader><CardTitle>Daily Attendance for {date}</CardTitle></CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b">
                                <tr>
                                    <th className="p-4 font-medium text-muted-foreground">Employee</th>
                                    <th className="p-4 font-medium text-muted-foreground">Check In</th>
                                    <th className="p-4 font-medium text-muted-foreground">Check Out</th>
                                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row) => (
                                    <tr key={row.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium">{row.full_name}</div>
                                            <div className="text-xs text-gray-500">{row.email}</div>
                                        </td>
                                        <td className="p-4">{row.check_in_time}</td>
                                        <td className="p-4">{row.check_out_time || '-'}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                    row.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && data.length === 0 && (
                                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No records found for this date</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
