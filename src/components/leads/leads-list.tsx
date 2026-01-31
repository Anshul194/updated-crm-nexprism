import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Trash2, ExternalLink } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from '@/lib/utils'
import type { Lead, PipelineStage } from '@/types'

interface LeadsListProps {
    leads: Lead[]
    stages: PipelineStage[]
    onLeadClick: (lead: Lead) => void
    onDeleteLead: (id: string) => void
}

export function LeadsList({ leads, stages, onLeadClick, onDeleteLead }: LeadsListProps) {
    return (
        <div className="flex-1 bg-card border border-border/60 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/40 text-[10px] uppercase font-bold tracking-widest text-muted-foreground border-b border-border/40">
                        <tr>
                            <th className="px-6 py-4">Organizational Unit</th>
                            <th className="px-6 py-4">Primary Stakeholder</th>
                            <th className="px-6 py-4">Projected Valuation</th>
                            <th className="px-6 py-4">Pipeline Phase</th>
                            <th className="px-6 py-4 text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-sm">
                        {leads.map((lead) => {
                            const stage = stages.find(s => s.id === lead.stage)
                            return (
                                <tr key={lead.id} className="hover:bg-accent/5 transition-colors group cursor-pointer" onClick={() => onLeadClick(lead)}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{lead.company}</div>
                                        <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">{lead.source}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-muted-foreground">{lead.name}</div>
                                        <div className="text-[10px] text-muted-foreground opacity-70">{lead.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-foreground tracking-tight">{formatCurrency(lead.value)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className={`rounded-md font-bold text-[9px] uppercase tracking-widest ${stage?.color?.replace('bg-', 'text-') || ''} bg-opacity-10 border-none`}>
                                            {stage?.label || lead.stage}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onLeadClick(lead)}>
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="font-sans">
                                                    <DropdownMenuItem className="text-xs font-semibold text-destructive" onClick={() => onDeleteLead(lead.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Expunge Lead
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                                    No data available in current view
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
