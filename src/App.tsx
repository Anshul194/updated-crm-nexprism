import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'

import { ReminderManager } from './components/reminder-manager'

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="nexprism-theme">
            <BrowserRouter>
                <ReminderManager />
                <AppRoutes />
                <Toaster />
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
