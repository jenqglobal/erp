# JenQ ERP - Premium SaaS Enterprise Resource Planning System

## 1. Project Overview

**Project Name:** JenQ ERP  
**Project Type:** Multi-tenant SaaS ERP Application  
**Core Feature:** Complete premium enterprise resource planning solution with AI-powered analytics, dark/light mode, and modern UI  
**Target Users:** Small to medium businesses seeking cloud-based ERP solutions  
**Status:** Premium Edition with Advanced Features

---

## 2. UI/UX Specification

### 2.1 Layout Structure

**Multi-Page App Model:**
- Landing Page (Marketing/Sales) - Premium Design
- Authentication Pages (Login/Register)
- Dashboard (Main Application) - AI Dashboard
- Module Pages (CRM, Inventory, Accounting, HR, Projects, Reports, Settings)

**Layout Regions:**
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Navigation | Search | Theme Toggle | User Menu │
├───────────┬─────────────────────────────────────────────────┤
│           │                                                 │
│ Sidebar   │              Main Content Area                 │
│ (240px)  │        (Premium Glass Effect)               │
│ Collaps- │                                                 │
│ ible    │                                                 │
│           │                                                 │
├───────────┴─────────────────────────────────────────────────┤
│ Footer: Version | Support Link | Status                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Visual Design - Premium Edition

**Color Palette (Light Mode):**
- Primary: `#2563EB` (Royal Blue)
- Secondary: `#1E293B` (Slate Dark)
- Accent: `#10B981` (Emerald Green)
- Gold: `#f59e0b` (Premium Gold)
- Platinum: `#6366f1` (Premium Platinum)
- Background: `#F8FAFC` (Slate 50)
- Surface: `#FFFFFF` (White)
- Text Primary: `#0F172A` (Slate 900)
- Text Secondary: `#64748B` (Slate 500)

**Color Palette (Dark Mode):**
- Background: `#0F172A` (Slate 950)
- Surface: `#1E293B` (Slate 900)
- Border: `#334155` (Slate 700)

**Typography:**
- Font Family: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- Headings: Bold with gradient text effects
- Body: 14px for clarity

**Premium UI Features:**
- Glass morphism effects
- Gradient backgrounds
- Animated transitions
- Glowing shadows
- Gradient borders
- Shine effects on cards

### 2.3 Components

**Theme Toggle:**
- One-click dark/light mode switch
- Persists to localStorage
- Respects system preference

**Premium Sidebar:**
- Collapsible with smooth animation
- Gradient backgrounds
- Hover glow effects
- Active state highlights

**Premium Cards:**
- Glass effect options
- Gradient borders
- Hover lift animations
- Progress bars with gradients

**Premium Buttons:**
- Gradient fills
- Glow shadows
- Scale animations on hover

---

## 3. Functional Specification

### 3.1 Core Modules

**1. Dashboard**
- KPI cards with gradient icons
- Revenue trend charts (Area charts)
- Activity feed with timestamps
- Quick stats (Tasks, Deals, Win Rate, NPS)
- Growth metrics visualization
- AI-powered insights badge

**2. CRM Module (Premium)**
- Pipeline Kanban board (6 stages)
- Deal value tracking
- Probability indicators
- Contact management
- Company profiles
- Stage progress bars

**3. Projects Module (Premium)**
- Kanban view (Planning, Active, On Hold, Completed)
- List view with progress
- Timeline/Gantt view
- Drag-and-drop support
- Priority badges
- Budget tracking

**4. Inventory Module**
- Product catalog
- Stock tracking
- Warehouse management

**5. Accounting Module**
- Chart of accounts
- Invoices management
- Expense tracking

**6. HR Module**
- Employee directory
- Leave management
- Attendance tracking

**7. Reports Module**
- Pre-built reports
- Export capabilities

**8. Settings Module**
- Company profile
- User management

### 3.2 Premium Features

**Dark/Light Mode System:**
- Full theme support
- Smooth transitions
- CSS variable based
- System preference detection

**AI-Powered Analytics:**
- Predictive insights
- Growth metrics
- Performance indicators
- Auto-generated mock data for demo

**Advanced Visualizations:**
- Area charts with gradients
- Progress bars
- Kanban boards
- Timeline views
- Metric cards

**Premium UI:**
- Gradient icons
- Glowing shadows
- Glass effects
- Shine animations
- Badge variations

---

## 4. Technical Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, JWT, bcrypt
- **Database:** better-sqlite3
- **Icons:** Lucide React
- **Build:** Full-stack monorepo

---

## 5. File Structure

```
D:\JenQ ERP
├── SPEC.md
├── package.json
├── server/
│   ├── index.js
│   ├── package.json
│   ├── /routes
│   ├── /models
│   ├── /middleware
│   └── /utils
└── client/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── /src
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── store/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── components/
    │   │   ├── UI.jsx
    │   │   ├── Form.jsx
    │   │   └── Layout.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CRM.jsx
    │   │   ├── Inventory.jsx
    │   │   ├── Accounting.jsx
    │   │   ├── HR.jsx
    │   │   ├── Projects.jsx
    │   │   ├── Reports.jsx
    │   │   └── Settings.jsx
    │   ├── services
    │   └── /public
```

---

## 6. Acceptance Criteria

### 6.1 Theme System
- [x] Dark/light toggle works
- [x] Persists to localStorage
- [x] System preference detection
- [x] Smooth transitions

### 6.2 Dashboard
- [x] All stat cards display
- [x] Charts render correctly
- [x] Activity feed works
- [x] Premium badges visible

### 6.3 Modules
- [x] Kanban views work
- [x] CRUD operations functional
- [x] Search/filter works
- [x] Progress indicators

### 6.4 Visual Design
- [x] Consistent premium colors
- [x] Smooth animations
- [x] Glass effects working
- [x] Responsive design

---

## 7. Premium Features Summary

1. **Dark/Light Mode** - Full theme switching with persistence
2. **Kanban Boards** - Drag-and-drop in Projects, Pipeline in CRM
3. **Timeline View** - Gantt-style project tracking
4. **AI Analytics Dashboard** - Predictive insights & metrics
5. **Premium UI** - Gradients, glows, glass effects
6. **Multiple View Modes** - List, Kanban, Timeline
7. **Progress Tracking** - Visual progress bars everywhere
8. **Advanced Charts** - Area charts, gradient fills
9. **Responsive Design** - Works on all devices
10. **Modern Animations** - Scale, glow, fade effects