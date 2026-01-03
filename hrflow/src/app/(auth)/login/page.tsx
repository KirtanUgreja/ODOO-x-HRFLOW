
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { login } from "@/actions/auth"
import { useActionState, useState } from "react"

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, { error: "" })
    const [role, setRole] = useState<'employee' | 'admin'>('employee')

    return (
        <div className="flex h-screen w-full items-center justify-center bg-bg-main px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Welcome back! Please select your role to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full mb-6 bg-slate-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setRole('employee')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'employee'
                                ? 'bg-white shadow text-slate-900'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            Employee
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'admin'
                                ? 'bg-white shadow text-slate-900'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            Admin
                        </button>
                    </div>

                    {state?.error && (
                        <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                            {state.error}
                        </div>
                    )}
                    <form action={formAction} className="space-y-4">
                        <input type="hidden" name="role" value={role} />
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
                            {isPending ? "Signing in..." : `SIGN IN AS ${role.toUpperCase()}`}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center flex-col space-y-2">
                    {role === 'admin' ? (
                        <p className="text-sm text-text-muted">
                            Don&apos;t have an Account?{" "}
                            <Link href="/signup" className="text-primary-coral hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    ) : (
                        <p className="text-sm text-text-muted text-center">
                            Employees must contact HR/Admin for account creation.
                        </p>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
