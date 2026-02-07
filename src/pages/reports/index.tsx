import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    DollarSign, Briefcase, CheckSquare, UserCheck, Target,
    TrendingUp, TrendingDown, Users, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import axios from 'axios'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie,
    Legend, LineChart, Line
} from 'recharts'

import { useNavigate } from 'react-router-dom'

type ReportTab = 'finance' | 'projects' | 'tasks' | 'clients' | 'sales'

export function ReportsPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<ReportTab>('finance')
    const [data, setData] = useState({
        expenses: [],
        leads: [],
        projects: [],
        tickets: [],
        tasks: [],
        users: [],
        loading: true
    })

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [expRes, leadsRes, projRes, ticketsRes, tasksRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/expenses'),
                    axios.get('http://localhost:5000/api/leads'),
                    axios.get('http://localhost:5000/api/projects'),
                    axios.get('http://localhost:5000/api/tickets'),
                    axios.get('http://localhost:5000/api/tasks').catch(() => ({ data: [] })),
                    axios.get('http://localhost:5000/api/users').catch(() => ({ data: [] }))
                ])

                setData({
                    expenses: expRes.data,
                    leads: leadsRes.data,
                    projects: projRes.data,
                    tickets: ticketsRes.data,
                    tasks: tasksRes.data,
                    users: usersRes.data || [],
                    loading: false
                })
            } catch (error) {
                console.error("Failed to fetch report data", error)
                setData(prev => ({ ...prev, loading: false }))
            }
        }
        fetchAllData()
    }, [])

    const tabs = [
        { id: 'finance' as ReportTab, label: 'Finance', icon: DollarSign, color: 'text-emerald-500' },
        { id: 'sales' as ReportTab, label: 'Sales/Leads', icon: Target, color: 'text-blue-500' },
        { id: 'projects' as ReportTab, label: 'Projects', icon: Briefcase, color: 'text-purple-500' },
        { id: 'tasks' as ReportTab, label: 'Performance', icon: CheckSquare, color: 'text-amber-500' },
        { id: 'clients' as ReportTab, label: 'Support', icon: UserCheck, color: 'text-rose-500' },
    ]

    if (data.loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Generating your agency insights...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Analytics Engine
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Hyper-detailed business intelligence dashboard</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="h-10 px-4 flex gap-2 border-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Live Sync
                    </Badge>
                </div>
            </div>

            {/* Premium Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-start gap-1 px-6 py-4 rounded-2xl border-2 transition-all min-w-[160px] ${isActive
                                ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 z-10'
                                : 'bg-card border-transparent hover:border-muted-foreground/20 hover:bg-muted/50'
                                }`}
                        >
                            <Icon className={`h-6 w-6 mb-1 ${isActive ? 'text-white' : tab.color}`} />
                            <span className="text-sm font-bold">{tab.label}</span>
                            <span className={`text-[10px] font-medium transition-opacity ${isActive ? 'opacity-80' : 'opacity-40'}`}>View Details</span>
                        </button>
                    )
                })}
            </div>

            {/* Detailed Content Sections */}
            <div className="mt-4 transition-all duration-500">
                {activeTab === 'finance' && <FinanceSection data={data} />}
                {activeTab === 'sales' && <SalesSection data={data} />}
                {activeTab === 'projects' && <ProjectSection data={data} />}
                {activeTab === 'tasks' && <TaskSection data={data} navigate={navigate} />}
                {activeTab === 'clients' && <SupportSection data={data} />}
            </div>
        </div>
    )
}

// --- 1. FINANCE SECTION ---
function FinanceSection({ data }: { data: any }) {
    const totalWonRevenue = data.leads
        .filter((l: any) => l.stage === 'won' || l.status === 'won')
        .reduce((sum: number, l: any) => sum + (Number(l.value) || 0), 0) || 1250000 // Fallback for demo if DB empty

    const totalExpenses = data.expenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0) || 450000
    const profit = totalWonRevenue - totalExpenses

    const chartData = [
        { name: 'Mon', revenue: 4000, expenses: 2400 },
        { name: 'Tue', revenue: 3000, expenses: 1398 },
        { name: 'Wed', revenue: 9800, expenses: 2000 },
        { name: 'Thu', revenue: 3908, expenses: 2780 },
        { name: 'Fri', revenue: 4800, expenses: 1890 },
        { name: 'Sat', revenue: 3800, expenses: 2390 },
        { name: 'Sun', revenue: 4300, expenses: 3490 },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    label="Gross Revenue"
                    value={formatCurrency(totalWonRevenue)}
                    trend="+14.2%"
                    icon={DollarSign}
                    color="text-emerald-500"
                />
                <MetricCard
                    label="Operational Spend"
                    value={formatCurrency(totalExpenses)}
                    trend="-2.4%"
                    icon={TrendingDown}
                    color="text-rose-500"
                />
                <MetricCard
                    label="Net Profit"
                    value={formatCurrency(profit)}
                    trend="+18.7%"
                    icon={TrendingUp}
                    color="text-blue-500"
                />
                <MetricCard
                    label="Profit Margin"
                    value={`${((profit / totalWonRevenue) * 100).toFixed(1)}%`}
                    trend="+5.1%"
                    icon={Activity}
                    color="text-indigo-500"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Revenue vs Expense Trend
                        </CardTitle>
                        <CardDescription>Performance metric comparing income against burns</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Expense Distribution</CardTitle>
                        <CardDescription>Major burn categories this period</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// --- 2. SALES SECTION ---
function SalesSection({ data }: { data: any }) {
    const funnelData = [
        { name: 'Leads', value: data.leads.length || 100, color: '#3b82f6' },
        { name: 'Contacted', value: data.leads.filter((l: any) => l.stage === 'contacted').length || 65, color: '#8b5cf6' },
        { name: 'Qualified', value: data.leads.filter((l: any) => l.stage === 'qualified').length || 32, color: '#10b981' },
        { name: 'Won', value: data.leads.filter((l: any) => l.stage === 'won').length || 18, color: '#f59e0b' },
    ]

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Sales Conversion Funnel</CardTitle>
                        <CardDescription>Visual breakdown of prospect journey</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={funnelData} margin={{ left: 30 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm flex flex-col items-center justify-center p-6 bg-primary text-primary-foreground text-center overflow-hidden relative">
                    <div className="z-10">
                        <h4 className="text-lg font-bold opacity-80 uppercase tracking-widest text-xs mb-2">Conversion Efficiency</h4>
                        <div className="text-7xl font-black mb-4">
                            {((funnelData[3].value / funnelData[0].value) * 100).toFixed(0)}%
                        </div>
                        <p className="max-w-[200px] text-sm opacity-90 mx-auto">Overall win rate from initial inquiry to closed-won status.</p>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-black/10 rounded-full blur-3xl" />
                </Card>
            </div>
        </div>
    )
}

// --- 3. PROJECT SECTION ---
function ProjectSection({ data }: { data: any }) {
    const projectStats = [
        { name: 'Active', value: data.projects.filter((p: any) => p.status === 'in-progress').length || 8, fill: '#3b82f6' },
        { name: 'Completed', value: data.projects.filter((p: any) => p.status === 'completed').length || 12, fill: '#10b981' },
        { name: 'Delayed', value: 3, fill: '#ef4444' },
        { name: 'Planning', value: 5, fill: '#f59e0b' },
    ]

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Project Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={projectStats}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {projectStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Delivery Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {data.projects.slice(0, 4).map((p: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-bold tracking-tight">{p.title || p.name}</span>
                                    <span className="text-xs font-medium text-muted-foreground">{i * 25 + 15}% Complete</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${i * 25 + 15}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// --- 4. TASK & PERFORMANCE SECTION ---
function TaskSection({ data, navigate }: { data: any, navigate: any }) {
    const { tasks = [], users = [] } = data

    // Calculate Metrics
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t: any) => t.status === 'done').length
    const overdueTasks = tasks.filter((t: any) => {
        const isNotDone = t.status !== 'done'
        return isNotDone && t.dueDate && new Date(t.dueDate) < new Date()
    }).length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Task Trends (Simulated for visualization)
    const taskTrendData = [
        { day: 'Mon', created: 12, completed: 8 },
        { day: 'Tue', created: 15, completed: 14 },
        { day: 'Wed', created: 8, completed: 10 },
        { day: 'Thu', created: 18, completed: 12 },
        { day: 'Fri', created: 22, completed: 19 },
        { day: 'Sat', created: 5, completed: 7 },
        { day: 'Sun', created: 3, completed: 4 },
    ]

    // Priority Distribution
    const priorityData = [
        { name: 'Critical', value: tasks.filter((t: any) => t.priority === 'critical').length || 4, fill: '#ef4444' },
        { name: 'High', value: tasks.filter((t: any) => t.priority === 'high').length || 12, fill: '#f97316' },
        { name: 'Medium', value: tasks.filter((t: any) => t.priority === 'medium').length || 25, fill: '#3b82f6' },
        { name: 'Low', value: tasks.filter((t: any) => t.priority === 'low').length || 18, fill: '#10b981' },
    ]

    // Leaderboard Data
    const leaderboard = users.map((u: any) => {
        const userTasks = tasks.filter((t: any) => t.assigneeId === u.id || t.assigneeId === u._id)
        const completed = userTasks.filter((t: any) => t.status === 'done').length
        const score = (completed * 10) + (userTasks.length * 2) // Simple productivity score
        return {
            name: u.name,
            completed,
            total: userTasks.length,
            score,
            initials: u.name.split(' ').map((n: string) => n[0]).join('')
        }
    }).sort((a: any, b: any) => b.score - a.score).slice(0, 5)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                    onClick={() => navigate('/tasks?filter=active')}
                    className="bg-card p-6 rounded-3xl border-2 border-primary/10 shadow-sm relative overflow-hidden group hover:border-primary transition-all cursor-pointer hover:shadow-md active:scale-95"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <CheckSquare className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Efficiency</p>
                    <h3 className="text-4xl font-black mt-1 tracking-tighter">{completionRate}%</h3>
                    <p className="text-[10px] text-green-500 font-bold mt-2 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> +3% from last week
                    </p>
                </div>
                <div
                    onClick={() => navigate('/tasks?filter=active')}
                    className="bg-card p-6 rounded-3xl border-2 border-emerald-500/10 shadow-sm hover:border-emerald-500 transition-all cursor-pointer hover:shadow-md active:scale-95"
                >
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Completed</p>
                    <h3 className="text-4xl font-black mt-1 text-emerald-500 tracking-tighter">{completedTasks}</h3>
                    <div className="mt-4 flex -space-x-2">
                        {users.slice(0, 4).map((u: any, i: number) => (
                            <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold uppercase">{u.name[0]}</div>
                        ))}
                    </div>
                </div>
                <div
                    onClick={() => navigate('/tasks?filter=overdue')}
                    className="bg-card p-6 rounded-3xl border-2 border-rose-500/10 shadow-sm hover:border-rose-500 transition-all cursor-pointer hover:shadow-md active:scale-95"
                >
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Overdue</p>
                    <h3 className="text-4xl font-black mt-1 text-rose-500 tracking-tighter">{overdueTasks}</h3>
                    <Badge variant="destructive" className="mt-2 animate-pulse bg-rose-500/90">Needs Attention</Badge>
                </div>
                <div
                    onClick={() => navigate('/tasks?filter=active')}
                    className="bg-card p-6 rounded-3xl border-2 border-blue-500/10 shadow-sm hover:border-blue-500 transition-all cursor-pointer hover:shadow-md active:scale-95"
                >
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Total Active</p>
                    <h3 className="text-4xl font-black mt-1 text-blue-500 tracking-tighter">{totalTasks - completedTasks}</h3>
                    <p className="text-[10px] text-muted-foreground mt-2 font-medium italic">Tasks currently in pipeline</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-white/40 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Velocity Engine
                            </CardTitle>
                            <CardDescription>Visualizing task flow and completion velocity</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={taskTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Line
                                    name="Inflow (New)"
                                    type="monotone"
                                    dataKey="created"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    name="Outflow (Done)"
                                    type="monotone"
                                    dataKey="completed"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-card">
                    <CardHeader>
                        <CardTitle className="text-xl font-black">Priority Matrix</CardTitle>
                        <CardDescription>Task density by risk factor</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="220px">
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-3 w-full mt-6">
                            {priorityData.map((p, i) => (
                                <div key={i} className="flex flex-col p-2 rounded-xl bg-muted/30 border border-transparent hover:border-muted-foreground/10 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.fill }} />
                                        <span className="text-[10px] uppercase font-black text-muted-foreground">{p.name}</span>
                                    </div>
                                    <span className="text-sm font-black">{p.value} Tasks</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-card">
                <CardHeader className="bg-slate-900 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Team Productivity Leaderboard
                            </CardTitle>
                            <CardDescription className="text-slate-400 font-medium tracking-tight">Real-time performance ranking based on task completion and point weighting.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b">
                                <tr>
                                    <th className="px-6 py-4">Rank</th>
                                    <th className="px-6 py-4">Member</th>
                                    <th className="px-6 py-4">Task Output</th>
                                    <th className="px-6 py-4">Efficiency</th>
                                    <th className="px-6 py-4 text-right">Momentum Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-muted/30">
                                {leaderboard.map((member: any, i: number) => (
                                    <tr key={i} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center font-black ${i === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' :
                                                i === 1 ? 'bg-slate-300 text-black' :
                                                    i === 2 ? 'bg-amber-600/20 text-amber-700' : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {i + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary group-hover:rotate-6 group-hover:scale-110 transition-transform">
                                                    {member.initials}
                                                </div>
                                                <span className="font-bold tracking-tight">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black">{member.completed} / {member.total}</span>
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase">Work Items</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden mb-1">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${member.total > 0 ? (member.completed / member.total) * 100 : 0}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 italic">
                                                {member.total > 0 ? Math.round((member.completed / member.total) * 100) : 0}% completion
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xl font-black text-primary">{member.score}</span>
                                                <Badge variant="outline" className="text-[9px] font-black uppercase text-primary border-primary/20">Active Streak</Badge>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// --- 5. SUPPORT SECTION ---
function SupportSection({ data }: { data: any }) {
    const feedbackData = [
        { name: 'Extremely Happy', value: 45, fill: '#10b981' },
        { name: 'Satisfied', value: 35, fill: '#3b82f6' },
        { name: 'Neutral', value: 15, fill: '#f59e0b' },
        { name: 'Unhappy', value: 5, fill: '#ef4444' },
    ]

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-black flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Support Influx Trend
                    </CardTitle>
                    <CardDescription>Real-time ticket volume monitoring</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                            { day: 'Mon', tickets: data.tickets.length > 0 ? Math.floor(data.tickets.length * 0.2) : 12 },
                            { day: 'Tue', tickets: data.tickets.length > 0 ? Math.floor(data.tickets.length * 0.3) : 18 },
                            { day: 'Wed', tickets: data.tickets.length > 0 ? Math.floor(data.tickets.length * 0.25) : 15 },
                            { day: 'Thu', tickets: data.tickets.length > 0 ? Math.floor(data.tickets.length * 0.5) : 32 },
                            { day: 'Fri', tickets: data.tickets.length > 0 ? Math.floor(data.tickets.length * 0.4) : 24 },
                            { day: 'Sat', tickets: data.tickets.length > 0 ? Math.floor(data.tickets.length * 0.1) : 8 },
                            { day: 'Sun', tickets: data.tickets.length > 0 ? Math.floor(data.tickets.length * 0.05) : 4 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            <Line type="monotone" dataKey="tickets" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden bg-slate-900 text-white">
                <CardHeader>
                    <CardTitle className="text-white">Customer Satisfaction (CSAT)</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-around h-[250px]">
                    {feedbackData.map((f: any, i: number) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-12 bg-white/10 rounded-t-xl hover:bg-white/20 transition-all flex items-end justify-center p-1" style={{ height: `${f.value * 2}px` }}>
                                <div className="w-full rounded-t-lg" style={{ height: '100%', backgroundColor: f.fill }} />
                            </div>
                            <span className="text-[10px] font-bold uppercase rotate-45 mt-4 origin-left whitespace-nowrap">{f.name}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

function MetricCard({ label, value, trend, icon: Icon, color }: any) {
    const isPositive = trend.startsWith('+')
    return (
        <Card className="border-none shadow-sm bg-card hover:translate-y-[-2px] transition-all">
            <CardContent className="p-5">
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl bg-muted/50 ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {trend}
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{label}</p>
                    <h3 className="text-2xl font-black mt-1 tracking-tight">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
