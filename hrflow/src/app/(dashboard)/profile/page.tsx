
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, MapPin, Briefcase, Building, X, Loader2 } from "lucide-react"
import { useEffect, useState, useActionState } from "react"
import { getFullProfileData, updateBasicProfile } from "@/actions/profile"
import { PersonalInfo } from "@/components/profile/personal-info"
import { BankingInfo } from "@/components/profile/banking-info"
import { SkillsInfo } from "@/components/profile/skills-info"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [updateState, updateAction, isUpdating] = useActionState(updateBasicProfile, null)

    useEffect(() => {
        if (updateState?.success) {
            setIsEditModalOpen(false)
            // Ideally trigger a refresh or let revalidatePath handle it (Next.js server action should auto-refresh client cache usually)
        }
    }, [updateState])
    const [personalInfo, setPersonalInfo] = useState<any>(null)
    const [bankingInfo, setBankingInfo] = useState<any>(null)
    const [skills, setSkills] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getData() {
            const data = await getFullProfileData()
            if (data) {
                setProfile(data.profile)
                setPersonalInfo(data.personal)
                setBankingInfo(data.banking)
                setSkills(data.skills)
            }
            setLoading(false)
        }
        getData()
    }, [])

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="relative rounded-lg bg-bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-avatar-bg text-3xl font-bold text-primary-coral">
                        {profile?.full_name?.charAt(0) || "U"}
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-text-main">{profile?.full_name || "Employee Name"}</h2>
                        <p className="text-text-muted">{profile?.department || "Department"} • {profile?.company || "Dayflow"}</p>
                        <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-text-muted md:justify-start">
                            <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" /> {profile?.email || "No Email"}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {profile?.location || "Location not set"}
                            </span>
                        </div>
                    </div>
                    <div className="md:ml-auto">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Info Component */}
                <PersonalInfo initialData={personalInfo} />

                {/* Professional Info / Skills */}
                <SkillsInfo initialData={skills} />

                {/* Banking Info Component */}
                <BankingInfo initialData={bankingInfo} />

                {/* Professional Details Placeholder or Component */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary-coral" />
                            Employment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-text-muted">Department</label>
                                <p className="text-sm font-medium">{profile?.department || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-text-muted">Manager ID</label>
                                <p className="text-sm font-medium">{profile?.manager_id || "N/A"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-lg shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Profile Link</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form action={updateAction} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input name="fullName" defaultValue={profile?.full_name || ''} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input name="phone" defaultValue={profile?.phone || ''} placeholder="+1234567890" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <Input name="location" defaultValue={profile?.location || ''} placeholder="New York, USA" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">About</label>
                                    <Textarea name="about" defaultValue={profile?.about || ''} rows={4} placeholder="Tell us about yourself..." />
                                </div>
                                {updateState?.error && <p className="text-sm text-red-500">{updateState.error}</p>}
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isUpdating} className="bg-primary-coral">
                                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
