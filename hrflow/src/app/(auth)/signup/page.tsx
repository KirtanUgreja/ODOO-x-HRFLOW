
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
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 px-4">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-8">
                    <CardTitle className="text-3xl font-bold text-center text-text-main">Create Account</CardTitle>
                    <CardDescription className="text-center text-base">
                        Get started with your admin account
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
                                Full Name
                            </label>
                            <Input name="fullName" placeholder="John Doe" required className="bg-white/50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-gray-700">
                                Email Address
                            </label>
                            <Input name="email" type="email" placeholder="name@company.com" required className="bg-white/50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-gray-700">
                                Phone Number
                            </label>
                            <Input name="phone" type="tel" placeholder="+1 (555) 000-0000" required className="bg-white/50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-gray-700">
                                Password
                            </label>
                            <Input name="password" type="password" required className="bg-white/50" />
                        </div>
                        <Button
                            variant="action"
                            className="w-full bg-primary-coral hover:bg-primary-coral/90 text-white shadow-lg shadow-primary-coral/20 mt-4"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary-coral font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
