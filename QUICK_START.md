# 🚀 Quick Start Guide - Nexprism Agency Management System

## Prerequisites

You need to install **Node.js** first (which includes npm).

### Install Node.js:
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer
4. Follow the installation wizard

### Verify Installation:
Open PowerShell and run:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.x.x
10.x.x
```

---

## Installation Steps

### 1. Navigate to Project Directory
```powershell
cd E:\CRM
```

### 2. Install Dependencies
```powershell
npm install
```

This will install all required packages (React, TypeScript, Tailwind, etc.)

**Note**: This might take 2-5 minutes depending on your internet speed.

### 3. Start Development Server
```powershell
npm run dev
```

You should see output like:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Open in Browser
Open your browser and go to:
```
http://localhost:5173
```

---

## 🎯 What You'll See

### 1. Login Page
- Enter **any email and password**
- Click "Sign In"
- You'll be redirected to the dashboard

### 2. Dashboard
- **KPI Cards**: Active projects, tasks due today, overdue tasks, pending invoices
- **My Tasks Widget**: Your upcoming tasks
- **Active Projects**: Projects in progress with completion percentage
- **Quick Actions**: Shortcuts to create clients, projects, tasks, invoices

### 3. Navigation
- **Sidebar**: Click any menu item to navigate
- **Collapse/Expand**: Click the arrow button on sidebar
- **Search**: Use the search bar in topbar
- **Notifications**: Click bell icon to see notifications
- **Theme Toggle**: Click sun/moon icon to switch dark/light mode
- **User Menu**: Click your avatar for profile options

---

## 🎨 Features to Explore

### Working Features:
✅ Login/Logout
✅ Dashboard with real data
✅ Navigation between pages
✅ Dark/Light mode
✅ Notifications dropdown
✅ Responsive sidebar
✅ User profile menu

### Placeholder Pages (Coming Soon):
🚧 Clients management
🚧 Projects with Kanban
🚧 Tasks list & detail
🚧 Team management
🚧 Time tracking
🚧 Invoices
🚧 Files
🚧 Settings

---

## 🛠️ Development Commands

### Start Development Server
```powershell
npm run dev
```

### Build for Production
```powershell
npm run build
```

### Preview Production Build
```powershell
npm run preview
```

### Type Check
```powershell
npx tsc --noEmit
```

---

## 📂 Project Structure Overview

```
E:\CRM\
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities & mock data
│   ├── store/          # State management
│   ├── types/          # TypeScript types
│   └── App.tsx         # Main app
├── public/             # Static assets
└── package.json        # Dependencies
```

---

## 🔧 Troubleshooting

### Problem: `npm` command not found
**Solution**: Install Node.js first (see Prerequisites above)

### Problem: Port 5173 already in use
**Solution**: Kill the process or use a different port:
```powershell
npm run dev -- --port 3000
```

### Problem: Dependencies installation fails
**Solution**: Clear cache and retry:
```powershell
npm cache clean --force
npm install
```

### Problem: Page shows errors
**Solution**: Check browser console (F12) for error details

---

## 🎓 Learning Resources

### Technologies Used:
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite**: https://vitejs.dev/
- **Zustand**: https://github.com/pmndrs/zustand
- **React Router**: https://reactrouter.com/

---

## 📞 Support

If you encounter any issues:
1. Check `BUILD_SUMMARY.md` for detailed documentation
2. Check browser console for errors (F12)
3. Verify all dependencies are installed
4. Make sure Node.js version is 18+ or 20+

---

## 🎉 You're All Set!

Your Nexprism Agency Management System is ready to use!

**Next Steps**:
1. Explore the dashboard
2. Click around to see the UI
3. Toggle dark mode
4. Check notifications
5. Navigate between pages

**Happy Coding! 🚀**
