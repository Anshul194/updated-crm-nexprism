import { useState, useMemo } from 'react'
import {
    Check, X, Plane, Calendar, Search,
    ChevronLeft, ChevronRight, Download,
    Star, Info
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getInitials } from '@/lib/utils'
import type { User } from '@/types'

interface AttendanceSheetProps {
    users: User[]
    currentUserId?: string
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'leave' | 'holiday' | 'off'

export function AttendanceSheet({ users, currentUserId }: AttendanceSheetProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [searchTerm, setSearchTerm] = useState('')

    const [holidays, setHolidays] = useState<number[]>([12, 26]) // Mock holidays
    const [weekendDays] = useState<number[]>([0, 6]) // Default: Sunday (0) and Saturday (6)

    // Key: "userId-dayOfMonth", Value: AttendanceStatus
    const [manualAttendance, setManualAttendance] = useState<Record<string, AttendanceStatus>>({})

    // Generate days for the current month
    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const days = new Date(year, month + 1, 0).getDate()
        return Array.from({ length: days }, (_, i) => {
            const date = new Date(year, month, i + 1)
            const isWeekend = weekendDays.includes(date.getDay())
            const isHoliday = holidays.includes(i + 1)
            return {
                date: i + 1,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                isWeekend,
                isHoliday
            }
        })
    }, [currentDate, holidays, weekendDays])

    const toggleHoliday = (day: number) => {
        setHolidays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const setStatus = (userId: string, day: number, status: AttendanceStatus) => {
        setManualAttendance(prev => ({
            ...prev,
            [`${userId}-${day}`]: status
        }))
    }

    // Mock Data Generator (Deterministic based on user + date)
    const getStatusForDay = (userId: string, day: number): AttendanceStatus => {
        // 1. Manual Override
        if (manualAttendance[`${userId}-${day}`]) return manualAttendance[`${userId}-${day}`]

        // 2. Holidays & Weekends (System)
        if (holidays.includes(day)) return 'holiday'
        if (daysInMonth[day - 1]?.isWeekend) return 'off'

        // 3. Random deterministic logic (Simulation)
        const seed = userId.charCodeAt(0) + day + currentDate.getMonth()
        const rand = (seed * 9301 + 49297) % 233280
        const result = rand % 100

        if (result < 3) return 'leave'
        if (result < 8) return 'absent'
        if (result < 15) return 'late'
        if (result < 20) return 'half-day'
        return 'present'
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

    const renderIcon = (status: AttendanceStatus) => {
        switch (status) {
            case 'present': return <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
            case 'absent': return <X className="h-4 w-4 text-slate-400" strokeWidth={3} />
            case 'late': return <Info className="h-4 w-4 text-amber-500 fill-amber-50" />
            case 'half-day': return <Star className="h-4 w-4 text-rose-500 fill-rose-500" />
            case 'leave': return <Plane className="h-4 w-4 text-rose-600" />
            case 'holiday': return <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            case 'off': return <Calendar className="h-4 w-4 text-rose-500" />
            default: return null
        }
    }

    const LegendItem = ({ icon, label }: { icon: any, label: string }) => (
        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground whitespace-nowrap">
            {icon}
            <span>&rarr;</span>
            <span className="text-foreground">{label}</span>
        </div>
    )

    return (
        <Card className="shadow-none border-none bg-transparent">
            <CardHeader className="px-0 pb-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">Note:</span>
                        <LegendItem icon={<Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />} label="Holiday" />
                        <span className="text-muted-foreground/30 px-1">|</span>
                        <LegendItem icon={<Calendar className="h-3.5 w-3.5 text-rose-500" />} label="Day Off" />
                        <span className="text-muted-foreground/30 px-1">|</span>
                        <LegendItem icon={<Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />} label="Present" />
                        <span className="text-muted-foreground/30 px-1">|</span>
                        <LegendItem icon={<Star className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />} label="Half Day" />
                        <span className="text-muted-foreground/30 px-1">|</span>
                        <LegendItem icon={<Info className="h-3.5 w-3.5 text-amber-500 fill-amber-50" />} label="Late" />
                        <span className="text-muted-foreground/30 px-1">|</span>
                        <LegendItem icon={<X className="h-3.5 w-3.5 text-slate-400" strokeWidth={3} />} label="Absent" />
                        <span className="text-muted-foreground/30 px-1">|</span>
                        <LegendItem icon={<Plane className="h-3.5 w-3.5 text-rose-600" />} label="On Leave" />
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold">Monthly Report</h2>
                            <div className="flex items-center border rounded-lg bg-background shadow-sm overflow-hidden h-9">
                                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-full rounded-none"><ChevronLeft className="h-4 w-4" /></Button>
                                <span className="px-3 font-bold text-xs min-w-[100px] text-center uppercase tracking-wider">
                                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </span>
                                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-full rounded-none"><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search Employee..."
                                    className="pl-9 w-full md:w-64 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm font-bold">
                                <Download className="h-4 w-4" /> Export
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 overflow-hidden border rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#f8f9fa]">
                                <th className="sticky left-0 z-20 bg-[#f8f9fa] border-b border-r py-4 px-4 min-w-[240px] text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Employee
                                </th>
                                {daysInMonth.map((d) => (
                                    <th
                                        key={d.date}
                                        onClick={() => toggleHoliday(d.date)}
                                        className={`
                                            border-b border-r py-2 min-w-[36px] w-[36px] cursor-pointer hover:bg-amber-50/50 transition-colors
                                            ${d.isWeekend ? 'bg-slate-50/50' : ''}
                                            ${d.isHoliday ? 'bg-amber-50/50' : ''}
                                        `}
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <span className={`text-[13px] font-bold ${d.isWeekend ? 'text-slate-400' : 'text-slate-700'}`}>{d.date}</span>
                                            <span className="text-[9px] uppercase font-bold text-slate-400 leading-none mt-0.5">{d.dayName}</span>
                                        </div>
                                    </th>
                                ))}
                                <th className="sticky right-0 z-20 bg-[#f8f9fa] border-b border-l py-4 px-2 min-w-[80px] text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={daysInMonth.length + 2} className="p-12 text-center text-muted-foreground font-medium">
                                        No employees found matching search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    let presentCount = 0
                                    const isSelf = user._id === currentUserId || user.id === currentUserId

                                    return (
                                        <tr key={user.id || user._id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/50 border-r py-3 px-4 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border-2 border-slate-100">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="text-xs bg-slate-100 text-slate-600 font-bold">{getInitials(user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="overflow-hidden">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[14px] font-bold text-slate-700 truncate">{user.name}</p>
                                                            {isSelf && (
                                                                <span className="bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">It's you</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-slate-400 font-medium truncate">{user.role || 'Staff Member'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {daysInMonth.map((d) => {
                                                const status = getStatusForDay(user.id || (user as any)._id, d.date)
                                                if (['present', 'late', 'half-day'].includes(status)) presentCount++

                                                return (
                                                    <td
                                                        key={d.date}
                                                        className={`
                                                            border-r p-0 h-12 text-center relative
                                                            ${d.isWeekend ? 'bg-slate-50/20' : ''}
                                                            ${status === 'holiday' ? 'bg-amber-50/10' : ''}
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-center h-full w-full">
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <div className="h-full w-full flex items-center justify-center cursor-pointer hover:bg-slate-100/50 transition-colors">
                                                                        {renderIcon(status)}
                                                                    </div>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-48 p-2 shadow-2xl border-slate-200">
                                                                    <div className="space-y-1">
                                                                        <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-widest border-b mb-1">
                                                                            Mark Attendance
                                                                        </div>
                                                                        {(['present', 'late', 'half-day', 'absent', 'leave'] as const).map((s) => (
                                                                            <Button
                                                                                key={s}
                                                                                variant="ghost"
                                                                                className={`w-full justify-start h-8 text-[11px] font-bold gap-3 rounded-md px-2 ${status === s ? 'bg-slate-100' : ''}`}
                                                                                onClick={() => setStatus(user.id || (user as any)._id, d.date, s)}
                                                                            >
                                                                                <div className="w-4 flex justify-center scale-75">{renderIcon(s)}</div>
                                                                                <span className="capitalize">{s.replace('-', ' ')}</span>
                                                                            </Button>
                                                                        ))}
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    </td>
                                                )
                                            })}

                                            <td className="sticky right-0 z-10 bg-white group-hover:bg-slate-50/50 border-l py-3 px-2 text-center transition-colors">
                                                <span className="text-[13px] font-bold text-slate-500">
                                                    {presentCount} <span className="text-slate-300 font-medium">/ {daysInMonth.length}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
