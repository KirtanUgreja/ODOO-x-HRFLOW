
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, Plus, X } from "lucide-react"
import { useState, useEffect } from "react"
import { addSkill, removeSkill } from "@/actions/profile"

export function SkillsInfo({ initialData = [] }: { initialData?: any[] }) {
    const [skills, setSkills] = useState<any[]>(initialData)
    const [newSkill, setNewSkill] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (initialData) {
            setSkills(initialData)
        }
    }, [initialData])

    const handleAddSkill = async () => {
        if (!newSkill.trim()) return
        setLoading(true)
        try {
            const res = await addSkill(newSkill)

            if (res.error) throw new Error(res.error)
            if (res.data) {
                setSkills([...skills, res.data])
                setNewSkill("")
            }
        } catch (error) {
            console.error('Error adding skill:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveSkill = async (id: string) => {
        try {
            const res = await removeSkill(id)
            if (res.error) throw new Error(res.error)
            setSkills(skills.filter(s => s.id !== id))
        } catch (error) {
            console.error('Error deleting skill:', error)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary-coral" />
                    Skills & Expertise
                </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2">
                            {skill.skill_name}
                            <button onClick={() => handleRemoveSkill(skill.id)} className="text-text-muted hover:text-red-500">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    {skills.length === 0 && <p className="text-sm text-text-muted">No skills added yet.</p>}
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Add a new skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button size="icon" onClick={handleAddSkill} disabled={loading || !newSkill.trim()}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
