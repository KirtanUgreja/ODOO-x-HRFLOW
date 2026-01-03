
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, MapPin, Briefcase, Building } from "lucide-react"
import { useEffect, useState } from "react"
import { getFullProfileData } from "@/actions/profile"
import { PersonalInfo } from "@/components/profile/personal-info"
import { BankingInfo } from "@/components/profile/banking-info"
import { SkillsInfo } from "@/components/profile/skills-info"

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
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
                        <Button variant="outline">Edit Profile</Button>
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
        </div>
    )
}
