"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/actions/auth"
import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    User,
    Users,
    CalendarCheck,
    CalendarDays,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    LogOut
} from "lucide-react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Employees",
        href: "/employees",
        icon: Users,
        roles: ["admin"],
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        title: "Attendance",
        href: "/attendance",
        icon: CalendarCheck,
    },
    {
        title: "Leave",
        href: "/leave",
        icon: CalendarDays,
    },
    {
        title: "Payroll",
        href: "/payroll",
        icon: CreditCard,
    },
]

interface SidebarProps {
    role?: string
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname()
    const [currentDate, setCurrentDate] = useState(new Date())

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const today = new Date().getDate()
        const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year

        const days = []

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="text-transparent">0</div>)
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = isCurrentMonth && day === today
            days.push(
                <div key={day} className={isToday ? "relative flex items-center justify-center" : "font-medium"}>
                    {isToday ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-coral text-white">
                            {day}
                        </span>
                    ) : (
                        day
                    )}
                </div>
            )
        }

        return days
    }

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-bg-card shadow-soft">
            <div className="flex h-16 items-center justify-center border-b px-6">
                <h1 className="text-2xl font-bold tracking-tight text-primary-coral">
                    Hrflow
                </h1>
            </div>
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-1 px-4">
                    {sidebarItems.map((item) => {
                        // Check if active (exact match or sub-path)
                        if (item.roles && !item.roles.includes(role || 'employee')) return null

                        const isActive =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname?.startsWith(item.href)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary-coral/10 text-primary-coral"
                                        : "text-text-muted hover:bg-gray-50 hover:text-text-main"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5",
                                        isActive ? "text-primary-coral" : "text-text-muted"
                                    )}
                                />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>

                {/* Sidebar Calendar */}
                <div className="px-4">
                    <div className="mb-4 rounded-xl bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-text-main">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h3>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                                    <ChevronLeft className="h-4 w-4 text-text-muted hover:text-text-main" />
                                </button>
                                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                                    <ChevronRight className="h-4 w-4 text-text-muted hover:text-text-main" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 text-center text-[0.65rem] text-text-muted mb-2">
                            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
                            {getDaysInMonth(currentDate)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t p-4">
                <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-red-50 hover:text-red-600">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
