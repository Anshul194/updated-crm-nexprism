import { Badge } from './ui/badge'
import type { TaskStatus, TaskPriority, ProjectStatus, InvoiceStatus } from '@/types'

interface StatusBadgeProps {
    status: TaskStatus | ProjectStatus | InvoiceStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
        // Task statuses
        'todo': 'secondary',
        'in-progress': 'default',
        'review': 'warning',
        'client-approval': 'warning',
        'done': 'success',

        // Project statuses
        'planning': 'secondary',
        'completed': 'success',
        'on-hold': 'destructive',

        // Invoice statuses
        'draft': 'secondary',
        'pending': 'warning',
        'paid': 'success',
        'overdue': 'destructive',
    }

    const labels: Record<string, string> = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'review': 'Review',
        'client-approval': 'Client Approval',
        'done': 'Done',
        'planning': 'Planning',
        'completed': 'Completed',
        'on-hold': 'On Hold',
        'draft': 'Draft',
        'pending': 'Pending',
        'paid': 'Paid',
        'overdue': 'Overdue',
    }

    return (
        <Badge variant={variants[status] || 'default'}>
            {labels[status] || status}
        </Badge>
    )
}

interface PriorityBadgeProps {
    priority: TaskPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
    const variants: Record<TaskPriority, 'default' | 'secondary' | 'warning' | 'destructive'> = {
        'low': 'secondary',
        'medium': 'default',
        'high': 'warning',
        'urgent': 'destructive',
    }

    const labels: Record<TaskPriority, string> = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'urgent': 'Urgent',
    }

    return (
        <Badge variant={variants[priority]}>
            {labels[priority]}
        </Badge>
    )
}
