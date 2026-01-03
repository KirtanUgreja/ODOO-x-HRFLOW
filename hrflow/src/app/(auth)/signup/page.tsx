
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signup } from "@/actions/auth"
import { useActionState } from "react"

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signup, { error: "" })

    return (
        <div className="flex h-screen w-full items-center justify-center bg-bg-main px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to get started with Dayflow
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
                                Full Name
                            </label>
                            <Input name="fullName" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Email
                            </label>
                            <Input name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Phone Number
                            </label>
                            <Input name="phone" type="tel" placeholder="+1 (555) 000-0000" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Password
                            </label>
                            <Input name="password" type="password" required />
                        </div>
                        <Button variant="action" className="w-full" type="submit" disabled={isPending}>
                            {isPending ? "Signing up..." : "SIGN UP"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-text-muted">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary-coral hover:underline">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
