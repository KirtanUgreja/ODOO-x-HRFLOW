
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
            <div className="flex h-screen w-full items-center justify-center bg-bg-main px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Select Role</CardTitle>
                        <CardDescription className="text-center">
                            Please select your role to proceed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full h-20 text-xl font-semibold hover:border-primary-coral/50 hover:bg-primary-coral/5"
                            onClick={() => setRole("admin")}
                        >
                            Admin
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-20 text-xl font-semibold hover:border-primary-coral/50 hover:bg-primary-coral/5"
                            onClick={() => setRole("employee")}
                        >
                            Employee
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-bg-main px-4">
            <Card className="w-full max-w-md relative">
                <Button
                    variant="ghost"
                    className="absolute top-4 left-4"
                    onClick={() => setRole(null)}
                >
                    ← Back
                </Button>
                <CardHeader className="space-y-1 pt-12">
                    <CardTitle className="text-2xl font-bold text-center">
                        {role === 'admin' ? 'Admin Login' : 'Employee Login'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state?.error && (
                        <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                            {state.error}
                        </div>
                    )}
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Email / Login ID
                            </label>
                            <Input name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Password
                            </label>
                            <Input name="password" type="password" required />
                        </div>
                        <Button variant="action" className="w-full" type="submit" disabled={isPending}>
                            {isPending ? "Signing in..." : "SIGN IN"}
                        </Button>
                    </form>
                </CardContent>
                {role === 'admin' && (
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-text-muted">
                            Don&apos;t have an Account?{" "}
                            <Link href="/signup" className="text-primary-coral hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
