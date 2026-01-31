import { useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock, GripVertical } from 'lucide-react'
import { type Task } from '@/types'
import { getInitials } from '@/lib/utils'

interface TaskCardProps {
    task: Task
    userName?: string
}

export function TaskCard({ task, userName }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    // Timer Logic
    const [elapsed, setElapsed] = useState(task.totalTimeSpent || 0)

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (task.isTimerRunning && task.lastStartTime) {
            // Update immediately to avoid 1s delay
            setElapsed((task.totalTimeSpent || 0) + (Date.now() - task.lastStartTime))

            interval = setInterval(() => {
                const now = Date.now()
                // Calculate current session duration
                const currentSession = now - (task.lastStartTime || now)
                setElapsed((task.totalTimeSpent || 0) + currentSession)
            }, 1000)
        } else {
            setElapsed(task.totalTimeSpent || 0)
        }

        return () => clearInterval(interval)
    }, [task.isTimerRunning, task.lastStartTime, task.totalTimeSpent])

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60)
        const minutes = Math.floor((ms / (1000 * 60)) % 60)
        const hours = Math.floor(ms / (1000 * 60 * 60))

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-card"
        >
            <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-start gap-2">
                    <div {...attributes} {...listeners} className="mt-1 text-muted-foreground hover:text-foreground cursor-grab">
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <span className={`text-sm font-medium leading-tight ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-3">
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <div className={`
                            flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono font-medium border
                            ${task.isTimerRunning ? 'bg-green-50 text-green-700 border-green-200 animate-pulse' : 'bg-muted text-muted-foreground'}
                        `}>
                            {task.isTimerRunning ? <Clock className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {formatTime(elapsed)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] px-1 py-0 h-5 capitalize ${task.priority === 'urgent' ? 'border-red-500 text-red-500' :
                            task.priority === 'high' ? 'border-orange-500 text-orange-500' : ''
                            }`}>
                            {task.priority}
                        </Badge>
                        <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[9px]">{getInitials(userName || 'NA')}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
