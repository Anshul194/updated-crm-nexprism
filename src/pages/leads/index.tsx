import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Settings, List, LayoutGrid, FileText, Trash2 } from 'lucide-react'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

import { useLeadsData } from '@/hooks/use-leads-data'
import { LeadsKPI } from '@/components/leads/leads-kpi'
import { KanbanBoard } from '@/components/leads/kanban-board'
import { LeadsList } from '@/components/leads/leads-list'
import { LeadDetailsDialog } from '@/components/leads/lead-details-dialog'
import { LeadFormBuilder } from '@/components/leads/lead-form-builder'
import type { Lead } from '@/types'

const COLOR_OPTIONS = [
    { value: 'bg-blue-500', label: 'Blue' }, { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-yellow-500', label: 'Yellow' }, { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-purple-500', label: 'Purple' }, { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-indigo-500', label: 'Indigo' }, { value: 'bg-orange-500', label: 'Orange' },
]

export function LeadsPage() {
    const { toast } = useToast()
    const {
        leads, stages, leadForms, setLeads, setStages, setLeadForms,
        updateLeadStage, deleteLead, addActivity, fetchData
    } = useLeadsData()

    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
    const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

    // Dialog States
    const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false)
    const [isStageDialogOpen, setIsStageDialogOpen] = useState(false)
    const [isLeadFormDialogOpen, setIsLeadFormDialogOpen] = useState(false)
    const [viewLeadDialogOpen, setViewLeadDialogOpen] = useState(false)

    // Form States
    const [newLead, setNewLead] = useState({ name: '', company: '', value: '', source: '', email: '', phone: '' })
    const [newStage, setNewStage] = useState({ label: '', color: 'bg-blue-500' })

    const handleAddLead = async () => {
        if (!newLead.name || !newLead.company) return
        try {
            const payload = {
                ...newLead,
                value: parseInt(newLead.value) || 0,
                source: newLead.source || 'Direct',
                stage: stages[0]?.id || 'new'
            }
            const res = await axios.post('http://localhost:5000/api/leads', payload)
            setLeads([...leads, { id: res.data._id, ...payload, activities: [], customFields: {} }])
            setNewLead({ name: '', company: '', value: '', source: '', email: '', phone: '' })
            setIsLeadDialogOpen(false)
            toast({ title: "Success", description: "Lead added successfully" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to add lead", variant: "destructive" })
        }
    }

    const handleAddStage = async () => {
        if (!newStage.label) return
        const stageId = newStage.label.toLowerCase().replace(/\s+/g, '-')
        const stagePayload = { id: stageId, label: newStage.label, color: newStage.color, order: stages.length }
        try {
            await axios.post('http://localhost:5000/api/leads/stages', stagePayload)
            setStages([...stages, stagePayload])
            setNewStage({ label: '', color: 'bg-blue-500' })
            setIsStageDialogOpen(false)
            toast({ title: "Success", description: "Stage added successfully" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to add stage", variant: "destructive" })
        }
    }

    const handleDeleteStage = async (stageId: string) => {
        if (stages.length <= 1) return
        try {
            await axios.delete(`http://localhost:5000/api/leads/stages/${stageId}`)
            fetchData()
            toast({ description: "Stage deleted and leads migrated" })
        } catch (error) {
            toast({ title: "Error", description: "Process failed", variant: "destructive" })
        }
    }

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col font-sans pb-10">
            {/* 1. Header Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0 animate-in fade-in duration-700">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Revenue Pipeline</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Manage strategic acquisitions and conversion velocity</p>
                </div>

                <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-2xl border border-border/40 backdrop-blur-sm">
                    <Button variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('kanban')} className="h-9 px-4 rounded-xl font-bold shadow-sm">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        Pipeline
                    </Button>
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="h-9 px-4 rounded-xl font-bold shadow-sm">
                        <List className="mr-2 h-4 w-4" />
                        Intelligence
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsLeadFormDialogOpen(true)} className="rounded-xl font-bold hover:bg-primary/5 transition-all text-xs border-border/60">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        Capture Engines
                    </Button>

                    <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-xl font-bold hover:bg-primary/5 transition-all text-xs border-border/60">
                                <Settings className="mr-2 h-4 w-4 text-primary" />
                                Workflow
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                            <DialogHeader><DialogTitle className="font-bold">Pipeline Architecture</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase">New Phase Name</Label>
                                    <Input value={newStage.label} onChange={(e) => setNewStage({ ...newStage, label: e.target.value })} placeholder="e.g., In Review" />
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {COLOR_OPTIONS.map((color) => (
                                        <button key={color.value} onClick={() => setNewStage({ ...newStage, color: color.value })} className={`h-8 rounded-lg ${color.value} ${newStage.color === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}`} />
                                    ))}
                                </div>
                                <Button onClick={handleAddStage} className="w-full font-bold">Instantiate Phase</Button>
                                <div className="pt-4 border-t">
                                    <h4 className="font-bold text-xs uppercase mb-3">Active Phases</h4>
                                    <div className="space-y-2">
                                        {stages.map((s) => (
                                            <div key={s.id} className="flex items-center justify-between p-2 rounded-xl border border-border/40 bg-muted/20">
                                                <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${s.color}`} /><span className="text-xs font-bold uppercase">{s.label}</span></div>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteStage(s.id)} disabled={stages.length <= 1}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl font-black bg-primary text-primary-foreground hover:scale-105 transition-all shadow-lg hover:shadow-primary/20">
                                <Plus className="mr-2 h-4 w-4" />
                                NEW ASSET
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader><DialogTitle className="font-black text-xl">PROVISION NEW ASSET</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5"><Label className="text-[10px] font-bold">STAKEHOLDER</Label><Input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} placeholder="Full Name" /></div>
                                    <div className="space-y-1.5"><Label className="text-[10px] font-bold">ORGANIZATION</Label><Input value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} placeholder="Company Name" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5"><Label className="text-[10px] font-bold">PROJECTED CAP</Label><Input type="number" value={newLead.value} onChange={(e) => setNewLead({ ...newLead, value: e.target.value })} placeholder="Deal Value" /></div>
                                    <div className="space-y-1.5"><Label className="text-[10px] font-bold">SOURCE PATH</Label><Input value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })} placeholder="e.g. Inbound" /></div>
                                </div>
                                <div className="space-y-1.5"><Label className="text-[10px] font-bold">COMMUNICATION CHANNEL</Label><Input value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} placeholder="Email Address" /></div>
                                <Button onClick={handleAddLead} className="w-full mt-4 font-black">DEPLOY ASSET</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* 2. Intelligence Metrics */}
            <LeadsKPI leads={leads} />

            {/* 3. Operational Viewport */}
            {viewMode === 'kanban' ? (
                <KanbanBoard
                    stages={stages}
                    leads={leads}
                    onDragStart={setDraggedLead}
                    onDrop={async (stageId) => draggedLead && updateLeadStage(draggedLead.id, stageId)}
                    onLeadClick={(l) => { setSelectedLead(l); setViewLeadDialogOpen(true); }}
                    onDeleteLead={deleteLead}
                />
            ) : (
                <LeadsList
                    leads={leads}
                    stages={stages}
                    onLeadClick={(l) => { setSelectedLead(l); setViewLeadDialogOpen(true); }}
                    onDeleteLead={deleteLead}
                />
            )}

            {/* 4. Global Dialogs */}
            <LeadDetailsDialog
                lead={selectedLead}
                isOpen={viewLeadDialogOpen}
                onClose={() => setViewLeadDialogOpen(false)}
                onUpdate={(updated) => { setSelectedLead(updated); setLeads(leads.map(l => l.id === updated.id ? updated : l)) }}
                onDelete={deleteLead}
                onAddActivity={addActivity}
            />

            <LeadFormBuilder
                isOpen={isLeadFormDialogOpen}
                onClose={() => setIsLeadFormDialogOpen(false)}
                leadForms={leadForms}
                setLeadForms={setLeadForms}
            />
        </div>
    )
}
