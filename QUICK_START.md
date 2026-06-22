# Quick Start Guide - UniExam Ops Frontend

## Installation & Setup

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

This will install all required packages including:
- React 19.2.6
- React Router 6.20.1
- Tailwind CSS 3.4.1
- Lucide React (icons)
- Vite (build tool)

### Step 2: Start Development Server
```bash
npm run dev
```

The application will start at: `http://localhost:5173`

### Step 3: Login with Demo Credentials

**Admin Access:**
- Email: `admin@exam.edu`
- Password: `admin123`
- Role: Administrator

**Professor Access:**
- Email: `prof@exam.edu`
- Password: `prof123`
- Role: Professor/Invigilator

---

## Project Structure

```
src/
├── pages/                 # All page components
│   ├── Login.jsx         # Authentication
│   ├── admin/            # Admin pages
│   └── professor/        # Professor pages
├── layouts/              # Navigation & layout
├── components/           # Reusable components
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
└── index.css            # Global styles
```

---

## Key Features

### ✨ For Administrators
- 📚 **Exam Management** - Create, edit, delete exams
- 👥 **Invigilator Management** - Assign and manage invigilators
- 🏛️ **Venue Management** - Manage exam halls and resources
- ⚠️ **Conflict Detection** - Automatically detect scheduling conflicts
- 📊 **Reports & Analytics** - Generate comprehensive reports
- 📋 **Attendance Tracking** - Monitor student attendance
- 📅 **Schedule Management** - View and manage exam schedules
- 🔔 **Notifications** - System-wide alerts

### 📖 For Professors/Invigilators
- 📆 **My Duties** - View assigned invigilator duties
- 📅 **Availability Management** - Update your availability
- ⚠️ **Conflict Reports** - Track scheduling conflicts
- 🔔 **Notifications** - Receive duty assignments and updates
- 📍 **Status Tracking** - Real-time duty status

---

## Available Scripts

### Development
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Navigation Guide

### Admin Dashboard
1. **Left Sidebar** - Access all admin features
2. **Dashboard** - View key metrics
3. **Exam Management** - Manage all exams
4. **Other Management** - Allocations, venues, invigilators, etc.

### Professor Dashboard
1. **Left Sidebar** - Access all professor features
2. **Dashboard** - View upcoming duties
3. **My Duties** - Review assigned duties
4. **Availability** - Update availability preferences

---

## Sidebar Functionality

### Collapse/Expand
- Click the menu icon (top-left) to toggle sidebar
- When collapsed: shows only icons (compact view)
- When expanded: shows full menu with text labels

### Menu Items (Admin)
- 🎯 Dashboard
- 📚 Exam Management (expandable)
- 👥 Allocation Management
- ⚠️ Conflict Management
- ✅ Attendance Management
- 📅 Schedule Management
- 👨‍🏫 Invigilator Management
- 🏛️ Venue Management
- 🔔 Notifications
- 📊 Reports

### Menu Items (Professor)
- 🎯 Dashboard
- 📆 My Duties
- 📅 Availability
- ⚠️ Conflict Report
- 🔔 Notifications

---

## Component Usage Examples

### Using Card Component
```jsx
<Card title="My Title" subtitle="Subtitle">
  Content here
</Card>
```

### Using StatCard Component
```jsx
<StatCard 
  label="Total"
  value="123"
  icon={BookOpen}
  change="12%"
  trend="up"
/>
```

### Using Button Component
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  <Plus size={20} />
  Add Item
</Button>
```

### Using Table Component
```jsx
<Table 
  columns={columns}
  data={data}
  actions={actions}
  pagination={pagination}
  onPageChange={handlePageChange}
/>
```

---

## Customization

### Change Brand Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    900: '#082f49',
  }
}
```

### Add New Page
1. Create component in `src/pages/`
2. Import in `App.jsx`
3. Add route in `<Routes>`

### Add New Component
1. Create in `src/components/`
2. Export component
3. Import and use in pages

---

## Testing Login

### Test Admin Features
1. Login as admin@exam.edu
2. Navigate through admin features
3. Try different page interactions
4. Test sidebar collapse/expand

### Test Professor Features
1. Login as prof@exam.edu
2. Navigate through professor features
3. Update availability
4. Review assigned duties

---

## Responsive Design

The app is responsive across all devices:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Laptop (1024px+)
- 🖥️ Desktop (1920px+)

Test by resizing browser or using DevTools.

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

## Demo Data

All pages include sample data:
- Sample exams with status
- Sample invigilators
- Sample conflicts
- Sample notifications
- Sample reports

---

## Next Steps

### For Backend Integration
1. Replace demo data with API calls
2. Use `axios` (already installed) for API requests
3. Update components to fetch real data
4. Implement form submissions to backend

### Example API Integration
```jsx
const [data, setData] = useState([]);

useEffect(() => {
  axios.get('/api/exams')
    .then(res => setData(res.data))
    .catch(err => console.error(err));
}, []);
```

---

## Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Tailwind Styles Not Working
```bash
# Rebuild Tailwind
npm run build
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Performance Tips

1. **Lazy Load Routes** - Already implemented with React Router
2. **Code Splitting** - Vite handles this automatically
3. **Image Optimization** - Use web formats
4. **Minimize Bundles** - Production build optimized

---

## Common Tasks

### Adding a New Menu Item
Edit `AdminLayout.jsx` or `ProfessorLayout.jsx`:
```jsx
const menuItems = [
  // ... existing items
  {
    icon: YourIcon,
    label: "New Item",
    path: "/admin/new-path"
  }
];
```

### Changing Button Style
Use variant prop:
```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>
```

### Creating a Modal
Add state and conditional rendering:
```jsx
const [isOpen, setIsOpen] = useState(false);

{isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    {/* Modal content */}
  </div>
)}
```

---

## Useful Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide React Icons](https://lucide.dev)
- [Vite Documentation](https://vitejs.dev)

---

## Support & Help

For issues or questions:
1. Check the SETUP_GUIDE.md
2. Review PAGES_GENERATED.md
3. Check component examples
4. Review existing page implementations

---

**Last Updated:** 2024
**Version:** 1.0.0
