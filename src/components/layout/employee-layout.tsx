import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { EmployeeSidebar } from './employee-sidebar'
import { Topbar } from './topbar' // Reusing Topbar
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmployeeLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50/90 dark:bg-zinc-900">
            {/* Employee Sidebar */}
            <EmployeeSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main Content Wrapper */}
            <div
                className={cn(
                    "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    collapsed ? "lg:ml-20" : "lg:ml-64"
                )}
            >
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                    {/* Mobile Menu Trigger */}
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex-1">
                        <Topbar onMenuClick={() => setMobileOpen(true)} />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
