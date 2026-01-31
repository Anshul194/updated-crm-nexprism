import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Lead, PipelineStage } from '@/types'

interface KanbanBoardProps {
    stages: PipelineStage[]
    leads: Lead[]
    onDragStart: (lead: Lead) => void
    onDrop: (stageId: string) => void
    onLeadClick: (lead: Lead) => void
    onDeleteLead: (id: string) => void
}

export function KanbanBoard({ stages, leads, onDragStart, onDrop, onLeadClick, onDeleteLead }: KanbanBoardProps) {
    const handleDragOver = (e: React.DragEvent) => e.preventDefault()

    return (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin">
            <div className="flex h-full gap-6 px-1" style={{ minWidth: `${stages.length * 320}px` }}>
                {stages.map((stage) => {
                    const stageLeads = leads.filter(l => l.stage === stage.id)
                    const stageValue = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0)

                    return (
                        <div
                            key={stage.id}
                            className="w-80 flex flex-col h-full bg-muted/20 rounded-2xl border border-border/40 transition-colors hover:bg-muted/30"
                            onDragOver={handleDragOver}
                            onDrop={() => onDrop(stage.id)}
                        >
                            {/* Stage Header */}
                            <div className="p-4 border-b bg-muted/40 backdrop-blur-sm rounded-t-2xl">
                                <div className="flex items-center justify-between mb-1.5">
                                    <h3 className="font-bold text-sm tracking-tight text-foreground uppercase">{stage.label}</h3>
                                    <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-background/50">{stageLeads.length}</Badge>
                                </div>
                                <div className={`h-1.5 w-full rounded-full ${stage.color} opacity-40 mb-3`} />
                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex justify-between">
                                    <span>Allocated Value</span>
                                    <span className="text-foreground">{formatCurrency(stageValue)}</span>
                                </div>
                            </div>

                            {/* Cards Container */}
                            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                {stageLeads.map((lead) => (
                                    <Card
                                        key={lead.id}
                                        draggable
                                        onDragStart={() => onDragStart(lead)}
                                        onClick={() => onLeadClick(lead)}
                                        className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing group group-hover:bg-accent/5"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">{lead.company}</div>
                                                <DropdownMenu modal={false}>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 font-sans">
                                                        <DropdownMenuItem className="text-xs font-semibold" onClick={(e) => { e.stopPropagation(); onLeadClick(lead); }}>
                                                            <ExternalLink className="mr-2 h-3.5 w-3.5" /> Open Record
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-xs font-semibold text-destructive" onClick={(e) => { e.stopPropagation(); onDeleteLead(lead.id); }}>
                                                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Expunge Lead
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                                                    {lead.name}
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                                    <span className="text-sm font-black text-foreground tracking-tight">{formatCurrency(lead.value)}</span>
                                                    {lead.source && (
                                                        <Badge variant="outline" className="text-[9px] uppercase font-bold px-1.5 py-0 border-border/60 text-muted-foreground">
                                                            {lead.source}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {stageLeads.length === 0 && (
                                    <div className="flex items-center justify-center py-12 border-2 border-dashed border-border/30 rounded-xl opacity-40">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Empty Pipeline</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
