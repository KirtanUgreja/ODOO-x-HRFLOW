
"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
    { day: "Mon", hours: 8.5 },
    { day: "Tue", hours: 7.8 },
    { day: "Wed", hours: 9.2 },
    { day: "Thu", hours: 8.0 },
    { day: "Fri", hours: 6.5 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
]

export function AttendanceChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
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
