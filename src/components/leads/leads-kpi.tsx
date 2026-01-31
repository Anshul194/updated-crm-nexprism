import { Card, CardContent } from '@/components/ui/card'
import { Users, DollarSign, Target, Coins, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Lead } from '@/types'

interface LeadsKPIProps {
    leads: Lead[]
}

export function LeadsKPI({ leads }: LeadsKPIProps) {
    const totalLeads = leads.length
    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0)
    const wonDeals = leads.filter(l => l.stage === 'closed' || l.stage === 'won').length
    const wonRevenue = leads.filter(l => l.stage === 'closed' || l.stage === 'won').reduce((sum, l) => sum + (l.value || 0), 0)
    const conversionRate = totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0

    const stats = [
        { title: "Total Leads", value: totalLeads, icon: Users, color: "#3b82f6", bg: "bg-blue-50" },
        { title: "Pipeline Value", value: formatCurrency(totalValue), icon: DollarSign, color: "#f59e0b", bg: "bg-amber-50" },
        { title: "Won Deals", value: wonDeals, icon: Target, color: "#8b5cf6", bg: "bg-purple-50" },
        { title: "Won Revenue", value: formatCurrency(wonRevenue), icon: Coins, color: "#22c55e", bg: "bg-green-50" },
        { title: "Conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "#06b6d4", bg: "bg-cyan-50" },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-shrink-0 animate-in fade-in slide-in-from-top-4 duration-500">
            {stats.map((stat, i) => (
                <Card key={i} className="border-l-4 shadow-sm hover:shadow-md transition-all" style={{ borderLeftColor: stat.color }}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={`p-2 rounded-lg ${stat.bg}`}>
                            <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
