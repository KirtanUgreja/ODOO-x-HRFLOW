
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreditCard, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { updateBankingInfo } from "@/actions/profile"

export function BankingInfo({ initialData }: { initialData?: any }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        bank_name: "",
        account_number: "",
        ifsc_code: "",
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                bank_name: initialData.bank_name || "",
                account_number: initialData.account_number || "",
                ifsc_code: initialData.ifsc_code || "",
            })
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await updateBankingInfo(formData)
            if (res.error) throw new Error(res.error)
            setIsEditing(false)
        } catch (error) {
            console.error('Error saving banking info:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary-coral" />
                    Banking Information
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                    {isEditing ? (loading ? "Saving..." : <Save className="h-4 w-4" />) : "Edit"}
                </Button>
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-muted">Bank Name</label>
                        {isEditing ? (
                            <Input name="bank_name" value={formData.bank_name} onChange={handleChange} />
                        ) : (
                            <p className="text-sm font-medium">{formData.bank_name || "N/A"}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-muted">IFSC Code</label>
                        {isEditing ? (
                            <Input name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} />
                        ) : (
                            <p className="text-sm font-medium">{formData.ifsc_code || "N/A"}</p>
                        )}
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-xs font-medium text-text-muted">Account Number</label>
                        {isEditing ? (
                            <Input name="account_number" value={formData.account_number} onChange={handleChange} />
                        ) : (
                            <p className="text-sm font-medium font-mono">
                                {formData.account_number ? `****${formData.account_number.slice(-4)}` : "N/A"}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
