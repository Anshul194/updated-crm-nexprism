import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description: string
    action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {Icon && (
                <div className="rounded-full bg-muted p-6 mb-4">
                    <Icon className="h-12 w-12 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
            {action && <div className="mt-2">{action}</div>}
        </div>
    )
}
