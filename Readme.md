# Acquiras - E-Procurement System

A web-based **Electronic Procurement (E-Proc)** information system for managing auction listings, vendor registration, blacklist monitoring, and procurement tracking.

## Quick Start

```bash
npm install
npm run dev
```

Access: [http://localhost:5173](http://localhost:5173)

## Tech Stack

- **React 18** + TypeScript
- **Tailwind CSS** + Tailwise Admin Template
- **React Router** v6
- **Headless UI** (Dialogs, Menus)
- **Lucide Icons**

## User Roles

| Role | Access |
|---|---|
| **Admin** | Full access — system configuration, user management, approval workflows, and all procurement data |
| **Vendor** | Register as a supplier, view active auctions, track procurement status, and manage submission history |

## Modules

### Public Dashboard
- Summary statistics (total auction packages, active auctions, registered vendors, procurement value)
- RUP distribution chart
- Auction category breakdown (Tender vs. Non-Tender)
- Weekly activity & 12-month procurement trend

### Admin Dashboard
- Vendor data management
- Auction & tender management
- Blacklist management
- Procurement monitoring
- Auction report with date range filter & PDF export
- App settings

### Vendor Portal
- New vendor registration
- Auction listing & participation
- Procurement monitoring (read-only)
- Submission & document history

## Features

- ✅ Role-based access control (RBAC)
- ✅ JWT authentication with token expiry validation
- ✅ Dark mode support
- ✅ Responsive design (mobile-first)
- ✅ PDF export for reports
- ✅ Interactive charts (bar, donut)
- ✅ Status badges with color coding

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── data/           # Mock/dummy data
├── router/         # Route definitions & guards
├── stores/         # Redux slices
└── themes/         # Theme configuration
```

## Development

```bash
npm run dev       # Start dev server
npm run build     # Type check & build
npm run lint      # Lint source files
```

---

© 2026 CV. Ramah Teknologi