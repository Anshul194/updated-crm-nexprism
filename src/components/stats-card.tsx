import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    color: string
    bg: string
}

export function StatsCard({ title, value, icon: Icon, color, bg }: StatsCardProps) {
    return (
        <Card className="border-l-4 shadow-sm" style={{ borderLeftColor: color }}>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon className="h-5 w-5" style={{ color: color }} />
                </div>
            </CardContent>
        </Card>
    )
}
