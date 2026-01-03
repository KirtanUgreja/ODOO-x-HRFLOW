"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CalendarOff, Clock, FileText } from "lucide-react"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import Link from "next/link"

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-primary-coral">Admin Dashboard</h2>
                <div className="text-sm text-text-muted">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPI_Card icon={Users} label="Total Employees" value="24" color="text-blue-600" bg="bg-blue-100" />
                <KPI_Card icon={Clock} label="On Time Today" value="18" color="text-green-600" bg="bg-green-100" />
                <KPI_Card icon={CalendarOff} label="On Leave" value="3" color="text-yellow-600" bg="bg-yellow-100" />
                <KPI_Card icon={FileText} label="Pending Requests" value="5" color="text-purple-600" bg="bg-purple-100" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Attendance Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <AttendanceChart />
                    </CardContent>
                </Card>

                {/* Recent Activities / Approvals */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <Link href="/employees" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                                <div className="rounded-full bg-blue-100 p-2">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Manage Employees</p>
                                    <p className="text-sm text-text-muted">Add, edit or remove staff</p>
                                </div>
                            </Link>
                            <Link href="/leave" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                                <div className="rounded-full bg-purple-100 p-2">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Leave Approvals</p>
                                    <p className="text-sm text-text-muted">5 requests pending</p>
                                </div>
                            </Link>
                            <Link href="/attendance" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                                <div className="rounded-full bg-green-100 p-2">
                                    <Clock className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Attendance Logs</p>
                                    <p className="text-sm text-text-muted">View daily reports</p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function KPI_Card({ icon: Icon, label, value, color, bg }: { icon: any, label: string, value: string, color: string, bg: string }) {
    return (
        <Card>
            <CardContent className="flex items-center p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bg} ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium text-text-muted">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
