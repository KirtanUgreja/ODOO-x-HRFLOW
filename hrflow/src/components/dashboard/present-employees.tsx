"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function PresentEmployees({ data }: { data: any[] }) {
    const presentCount = data ? data.length : 0

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Now</CardTitle>
                <span className="text-2xl font-bold text-green-600">{presentCount}</span>
            </CardHeader>
            <CardContent>
                <div className="flex -space-x-2 overflow-hidden py-2">
                    {data && data.slice(0, 5).map((employee) => (
                        <Avatar key={employee.id} className="inline-block h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-primary-coral text-xs text-white">
                                {employee.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                    {data && data.length > 5 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{data.length - 5}
                        </div>
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Employees currently checked in
                </p>
            </CardContent>
        </Card>
    )
}
