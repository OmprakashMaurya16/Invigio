# UniExam Ops - Frontend

A comprehensive React + Tailwind CSS application for managing university examination operations.

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx                          # Authentication page
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx                  # Admin dashboard
│   │   │   ├── AllocationManagement.jsx       # Seat allocation management
│   │   │   ├── AttendanceManagement.jsx       # Student attendance tracking
│   │   │   ├── ConflictManagement.jsx         # Conflict detection & resolution
│   │   │   ├── InvigilatorManagement.jsx      # Invigilator assignment
│   │   │   ├── Notifications.jsx              # Admin notifications
│   │   │   ├── Reports.jsx                    # Generate reports
│   │   │   ├── ScheduleManagement.jsx         # Exam scheduling
│   │   │   ├── VenueManagement.jsx            # Venue resource management
│   │   │   └── exam/
│   │   │       ├── ExamManagement.jsx         # List all exams
│   │   │       ├── AddExam.jsx                # Create new exam
│   │   │       ├── EditExam.jsx               # Edit exam details
│   │   │       └── ExamDetails.jsx            # View exam information
│   │   └── professor/
│   │       ├── Dashboard.jsx                  # Professor dashboard
│   │       ├── MyDuties.jsx                   # View assigned duties
│   │       ├── Availability.jsx               # Manage availability
│   │       ├── ConflictReport.jsx             # View conflicts
│   │       └── Notifications.jsx              # Professor notifications
│   ├── layouts/
│   │   ├── AdminLayout.jsx                    # Admin navigation & layout
│   │   └── ProfessorLayout.jsx                # Professor navigation & layout
│   ├── components/
│   │   ├── Card.jsx                           # Reusable card component
│   │   ├── StatCard.jsx                       # Statistics card
│   │   ├── Button.jsx                         # Reusable button
│   │   └── Table.jsx                          # Reusable table with pagination
│   ├── App.jsx                                # Main app with routing
│   ├── main.jsx                               # Entry point
│   └── index.css                              # Tailwind CSS styles
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── index.html
```

## Features

### Admin Dashboard
- **Exam Management**: Create, edit, and delete exams
- **Allocation Management**: Generate and manage seat allocations
- **Conflict Management**: Detect and resolve scheduling conflicts
- **Attendance Tracking**: Monitor student attendance
- **Schedule Management**: View and manage examination schedules
- **Invigilator Management**: Assign and manage invigilators
- **Venue Management**: Manage examination venues and facilities
- **Reports**: Generate comprehensive reports
- **Notifications**: System-wide notifications

### Professor Dashboard
- **My Duties**: View assigned invigilator duties
- **Availability Management**: Update availability and time preferences
- **Conflict Report**: Track and report scheduling conflicts
- **Notifications**: Receive duty notifications and updates

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Lint Code

```bash
npm run lint
```

## Technologies Used

- **React 19.2.6**: UI library
- **React Router 6.20.1**: Client-side routing
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Lucide React 0.292.0**: Beautiful icon library
- **Vite**: Modern build tool
- **PostCSS**: CSS transformations
- **Autoprefixer**: CSS vendor prefixes

## Login Information

### Demo Credentials

**Administrator:**
- Email: admin@exam.edu
- Password: admin123

**Professor/Invigilator:**
- Email: prof@exam.edu
- Password: prof123

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px and above)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## Color Scheme

- **Primary**: Sky Blue (#0ea5e9)
- **Danger**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)
- **Success**: Green (#22c55e)
- **Gray**: Multi-tone grayscale

## Key Components

### Card Component
Reusable card wrapper with optional title and subtitle.

```jsx
<Card title="Title" subtitle="Subtitle">
  Content here
</Card>
```

### StatCard Component
Displays statistics with icon, label, and value.

```jsx
<StatCard 
  label="Total Exams"
  value="142"
  icon={BookOpen}
  change="12%"
  trend="up"
/>
```

### Button Component
Versatile button with multiple variants and sizes.

```jsx
<Button variant="primary" size="md">
  Click me
</Button>
```

### Table Component
Reusable table with sorting and pagination.

```jsx
<Table 
  columns={columns}
  data={data}
  actions={actions}
/>
```

## Navigation Structure

### Admin Navigation
- Dashboard
- Exam Management (with submenu)
- Allocation Management
- Conflict Management
- Attendance Management
- Schedule Management
- Invigilator Management
- Venue Management
- Notifications
- Reports

### Professor Navigation
- Dashboard
- My Duties
- Availability
- Conflict Report
- Notifications

## Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced conflict resolution algorithms
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Data export to multiple formats
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app

## Notes

- All pages are fully functional with demo data
- Forms are ready for backend integration
- Routing is properly configured
- Sidebar can be collapsed for better UX
- Responsive design implemented throughout

## Support

For issues or questions, please contact the development team.
