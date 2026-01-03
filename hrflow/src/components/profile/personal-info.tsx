
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { updatePersonalInfo } from "@/actions/profile"

export function PersonalInfo({ initialData }: { initialData?: any }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        date_of_birth: "",
        gender: "",
        nationality: "",
        marital_status: "",
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                date_of_birth: initialData.date_of_birth || "",
                gender: initialData.gender || "",
                nationality: initialData.nationality || "",
                marital_status: initialData.marital_status || "",
            })
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await updatePersonalInfo(formData)
            if (res.error) {
                setError(res.error)
                return
            }
            setIsEditing(false)
        } catch (error) {
            console.error('Error saving personal info:', error)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary-coral" />
                    Personal Information
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                    {isEditing ? (loading ? "Saving..." : <Save className="h-4 w-4" />) : "Edit"}
                </Button>
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-muted">Date of Birth</label>
                        {isEditing ? (
                            <Input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" />
                        ) : (
                            <p className="text-sm font-medium">{formData.date_of_birth || "N/A"}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-muted">Gender</label>
                        {isEditing ? (
                            <Input name="gender" value={formData.gender} onChange={handleChange} />
                        ) : (
                            <p className="text-sm font-medium">{formData.gender || "N/A"}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-muted">Nationality</label>
                        {isEditing ? (
                            <Input name="nationality" value={formData.nationality} onChange={handleChange} />
                        ) : (
                            <p className="text-sm font-medium">{formData.nationality || "N/A"}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-muted">Marital Status</label>
                        {isEditing ? (
                            <Input name="marital_status" value={formData.marital_status} onChange={handleChange} />
                        ) : (
                            <p className="text-sm font-medium">{formData.marital_status || "N/A"}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
