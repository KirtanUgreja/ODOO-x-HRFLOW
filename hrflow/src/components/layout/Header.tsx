"use client"

import { Bell, Calendar } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-bg-card px-8 shadow-sm">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-text-main">
                    Welcome back, Employee
                </h2>
                <div className="flex items-center gap-2 text-text-muted">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate()}</span>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <button className="relative text-text-muted hover:text-text-main">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary-coral shadow-sm ring-2 ring-white" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-avatar-bg text-sm font-bold text-primary-coral">
                        EP
                    </div>
                    <div className="hidden text-sm md:block">
                        <p className="font-medium text-text-main">Employee Name</p>
                        <p className="text-xs text-text-muted">Software Engineer</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
