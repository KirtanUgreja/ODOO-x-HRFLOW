
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { login } from "@/actions/auth"
import { useActionState, useState } from "react"

export default function LoginPage() {
    const [role, setRole] = useState<"admin" | "employee" | null>(null)
    const [state, formAction, isPending] = useActionState(login, { error: "" })

    if (!role) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 px-4">
                <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-8">
                        <CardTitle className="text-3xl font-bold text-center text-text-main">Welcome Back</CardTitle>
                        <CardDescription className="text-center text-base">
                            Choose your portal to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button
                            variant="outline"
                            className="w-full h-24 text-lg font-medium border-2 hover:border-primary-coral hover:bg-primary-coral/5 transition-all group relative overflow-hidden"
                            onClick={() => setRole("admin")}
                        >
                            <div className="flex flex-col items-center gap-1 z-10">
                                <span className="text-sm font-bold text-primary-coral uppercase tracking-wide">Administrator</span>
                                <span className="text-gray-500 font-normal text-xs">Manage workspace & employees</span>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-24 text-lg font-medium border-2 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            onClick={() => setRole("employee")}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">Employee</span>
                                <span className="text-gray-500 font-normal text-xs">Access your dashboard</span>
                            </div>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 px-4">
            <Card className="w-full max-w-md relative shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <Button
                    variant="ghost"
                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 hover:bg-transparent"
                    onClick={() => setRole(null)}
                >
                    ← Back
                </Button>
                <CardHeader className="space-y-1 pt-12">
                    <CardTitle className="text-2xl font-bold text-center text-text-main">
                        {role === 'admin' ? 'Admin Portal' : 'Employee Portal'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state?.error && (
                        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex justify-center">
                            {state.error}
                        </div>
                    )}
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-gray-700">
                                Email Address
                            </label>
                            <Input name="email" type="email" placeholder="name@company.com" required className="bg-white/50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-gray-700">
                                Password
                            </label>
                            <Input name="password" type="password" required className="bg-white/50" />
                        </div>
                        <Button
                            variant="action"
                            className="w-full bg-primary-coral hover:bg-primary-coral/90 text-white shadow-lg shadow-primary-coral/20 mt-2"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                {role === 'admin' && (
                    <CardFooter className="flex justify-center pb-8">
                        <p className="text-sm text-gray-500">
                            New organization?{" "}
                            <Link href="/signup" className="text-primary-coral font-semibold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
