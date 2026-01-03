"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/actions/auth"
import {
    LayoutDashboard,
    User,
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

export function Sidebar() {
    const pathname = usePathname()

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
                        // For root dashboard, exact match. For others, startsWith
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
                            <h3 className="text-sm font-semibold text-text-main">January 2026</h3>
                            <div className="flex gap-1">
                                <ChevronLeft className="h-4 w-4 text-text-muted" />
                                <ChevronRight className="h-4 w-4 text-text-muted" />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 text-center text-[0.65rem] text-text-muted mb-2">
                            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
                            {/* Mock Calendar Days for Jan 2026 (Jan 1 is Thursday) */}
                            <div className="text-transparent">0</div><div className="text-transparent">0</div><div className="text-transparent">0</div><div className="text-transparent">0</div>
                            <div className="font-medium">1</div><div className="font-medium">2</div><div className="font-medium">3</div>
                            <div className="font-medium">4</div><div className="font-medium">5</div><div className="font-medium">6</div><div className="font-medium">7</div><div className="font-medium">8</div><div className="font-medium">9</div><div className="font-medium">10</div>
                            <div className="font-medium">11</div><div className="font-medium">12</div>
                            <div className="relative flex items-center justify-center">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-coral text-white">13</span>
                            </div>
                            <div className="font-medium">14</div><div className="font-medium">15</div><div className="font-medium">16</div><div className="font-medium">17</div>
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
