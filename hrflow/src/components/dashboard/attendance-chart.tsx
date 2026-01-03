
"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import { getAttendanceData } from "@/actions/attendance"

export function AttendanceChart() {
    const [chartData, setChartData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const data = await getAttendanceData()
            if (data?.recentAttendance) {
                // Process attendance data for chart
                const processedData = data.recentAttendance.slice(0, 7).reverse().map((record: any, index: number) => {
                    const date = new Date(record.date)
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    
                    let hours = 0
                    if (record.check_in_time && record.check_out_time) {
                        const checkIn = new Date(`2000-01-01T${record.check_in_time}`)
                        const checkOut = new Date(`2000-01-01T${record.check_out_time}`)
                        hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
                    }
                    
                    return {
                        day: dayNames[date.getDay()],
                        hours: Math.round(hours * 10) / 10
                    }
                })
                setChartData(processedData)
            } else {
                // Fallback data if no attendance records
                setChartData([
                    { day: "Mon", hours: 0 },
                    { day: "Tue", hours: 0 },
                    { day: "Wed", hours: 0 },
                    { day: "Thu", hours: 0 },
                    { day: "Fri", hours: 0 },
                    { day: "Sat", hours: 0 },
                    { day: "Sun", hours: 0 },
                ])
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-text-muted">Loading chart...</div>
            </div>
        )
    }
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
                <XAxis
                    dataKey="day"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}h`}
                />
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-bg-card p-2 shadow-sm">
                                    <span className="text-[0.70rem] uppercase text-text-muted">
                                        Hours Worked
                                    </span>
                                    <span className="block font-bold text-text-main">
                                        {payload[0].value}
                                    </span>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#FF5A36"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#FF5A36" }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
