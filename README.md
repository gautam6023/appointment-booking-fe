# BirdChime - Appointment Booking System (Frontend)

A modern, full-featured appointment booking system built with React, TypeScript, and Vite. BirdChime provides an intuitive interface for scheduling and managing appointments with a clean, responsive design.

## 🚀 Features

### Core Functionality
- **📅 Weekly Calendar View** - Visual calendar displaying available time slots for booking
- **🎯 Smart Scheduling** - Fixed working days (Monday-Friday) with 30-minute time slots
- **👥 Multi-Guest Support** - Add multiple guests to appointments with email validation
- **✏️ Full CRUD Operations** - Create, view, edit, reschedule, and delete appointments
- **🔍 Advanced Filtering** - Filter appointments by upcoming/past with pagination
- **🔗 Shareable Links** - Public calendar view for easy booking via unique URLs

### Technical Features
- **🔐 Authentication** - Secure login/register with JWT-based auth
- **⚡ React Query** - Optimized data fetching and caching
- **📱 Responsive Design** - Mobile-first design with Tailwind CSS
- **🎨 Modern UI** - Clean interface with shadcn/ui components
- **🛡️ Type Safety** - Full TypeScript implementation
- **🏗️ Modular Architecture** - Component-based design for maintainability

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** or **pnpm**
- **Backend API** running (see backend repository)

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd birdchime/fe
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Application Configuration
VITE_APP_NAME=BirdChime
VITE_APP_ENV=development
```

**Important:** Make sure the `VITE_API_BASE_URL` matches the URL where your backend API is running.

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### 5. Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The production-ready files will be in the `dist` directory.

### 6. Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📁 Project Structure

```
fe/
├── src/
│   ├── api/                    # API integration layer
│   │   ├── appointments.ts     # Appointment-related API calls
│   │   ├── auth.ts            # Authentication API calls
│   │   └── routes.ts          # API route constants
│   ├── components/            # Reusable components
│   │   ├── Calendar/          # Calendar component modules
│   │   │   ├── CalendarHeader.tsx
│   │   │   ├── CalendarGrid.tsx
│   │   │   ├── DayColumn.tsx
│   │   │   ├── TimeSlot.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.tsx
│   │   ├── modals/            # Modal components
│   │   │   ├── BookingModal/
│   │   │   ├── EditAppointmentDrawer/
│   │   │   ├── AppointmentDetailsModal.tsx
│   │   │   └── DeleteConfirmationModal.tsx
│   │   ├── ui/                # Base UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/               # React Context providers
│   │   └── AuthContext.tsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useGuestEmails.ts
│   │   ├── useModalState.ts
│   │   └── useAppointmentActions.ts
│   ├── lib/                   # Core libraries
│   │   ├── axios.ts          # Axios instance configuration
│   │   └── queryKeys.ts      # React Query key factory
│   ├── pages/                 # Page components
│   │   ├── Appointments/     # Appointments management page
│   │   │   ├── components/
│   │   │   │   ├── AppointmentCard.tsx
│   │   │   │   ├── AppointmentFilters.tsx
│   │   │   │   ├── AppointmentList.tsx
│   │   │   │   ├── AppointmentPagination.tsx
│   │   │   │   └── EmptyState.tsx
│   │   │   └── index.tsx
│   │   ├── Dashboard/        # User dashboard
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── PublicCalendar.tsx
│   ├── routes/               # Route configuration
│   │   ├── Routes.tsx
│   │   ├── PublicRoutes.tsx
│   │   └── PrivateRoutes.tsx
│   ├── types/                # TypeScript type definitions
│   │   └── appointments.ts
│   ├── utils/                # Utility functions
│   │   ├── appointmentHelpers.ts
│   │   ├── errorHandlers.ts
│   │   ├── formValidation.ts
│   │   ├── timeUtils.ts
│   │   └── constants.ts
│   ├── App.tsx              # Root application component
│   ├── main.tsx             # Application entry point
│   └── App.css              # Global styles
├── public/                   # Static assets
├── .env.example             # Environment variables template
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## 🏢 Application Pages

### Public Pages
1. **Login** (`/login`)
   - User authentication
   - Redirects to dashboard on success

2. **Register** (`/register`)
   - New user registration
   - Email, name, and password required

3. **Public Calendar** (`/calendar/:sharableId`)
   - View available time slots
   - Book appointments without authentication
   - Accessible via unique sharable link

### Protected Pages (Requires Authentication)
1. **Dashboard** (`/dashboard`)
   - Overview of your account
   - Quick access to calendar and appointments
   - Display sharable booking link
   - Copy link functionality

2. **Appointments** (`/appointments`)
   - List all your appointments
   - Filter by upcoming/past
   - Pagination support
   - Edit and delete functionality
   - Detailed appointment information

## ⏰ Booking System Details

### Working Days & Hours
- **Working Days**: Monday to Friday
- **Working Hours**: 9:00 AM - 5:00 PM
- **Weekend**: Saturday and Sunday (Not Available)
- **Time Slots**: 30-minute intervals
- **Slots per Day**: 16 slots (8 hours × 2 slots/hour)

### Slot Configuration
```
Monday - Friday:
09:00 - 09:30
09:30 - 10:00
10:00 - 10:30
10:30 - 11:00
11:00 - 11:30
11:30 - 12:00
12:00 - 12:30
12:30 - 13:00
13:00 - 13:30
13:30 - 14:00
14:00 - 14:30
14:30 - 15:00
15:00 - 15:30
15:30 - 16:00
16:00 - 16:30
16:30 - 17:00
```

### Appointment Features
- **Primary Booker**: Name, email (required), phone (optional)
- **Additional Guests**: Up to unlimited guests via email
- **Guest Validation**: 
  - Email format validation
  - No duplicate guests
  - Guest email cannot match primary email
- **Appointment Reason**: Optional text field (max 500 characters)
- **Status**: Pending or Done
- **Actions**:
  - View appointment details
  - Edit appointment information
  - Reschedule to different time slot
  - Cancel/Delete appointment

### Calendar Navigation
- **View**: Week-by-week navigation
- **Navigation**: Previous/Next week buttons
- **Current Week**: Displayed date range
- **Slot States**:
  - Available (Blue) - Ready to book
  - Booked (Gray) - Already scheduled
  - Past (Disabled) - Cannot book past slots

## 🎨 UI Components

### Component Library
- **Base Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Toasts**: Sonner
- **Dialogs/Drawers**: Radix UI Primitives

### Design System
- **Colors**: Blue primary, Gray neutrals
- **Typography**: System font stack
- **Spacing**: Tailwind spacing scale
- **Responsive**: Mobile-first breakpoints
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## 🔧 Development Tools

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **TypeScript**: Type checking
- **Prettier**: Code formatting (if configured)

## 🏗️ Architecture

### State Management
- **React Query**: Server state (API data)
- **React Context**: Auth state
- **Component State**: Local UI state

### API Communication
- **HTTP Client**: Axios
- **Base URL**: Configured via environment variables
- **Authentication**: Cookie-based with credentials
- **Error Handling**: Centralized error handlers

### Routing
- **Router**: React Router v6
- **Route Protection**: Custom ProtectedRoute component
- **Public Routes**: Login, Register, Public Calendar
- **Private Routes**: Dashboard, Appointments

### Data Flow
```
User Action → React Query Mutation → API Call → 
Backend Processing → Response → Cache Update → 
UI Re-render → User Feedback (Toast)
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT token (stored in HTTP-only cookie)
3. Frontend makes authenticated requests with credentials
4. Auth context manages user state
5. Protected routes verify authentication
6. Token refresh handled automatically

## 🚀 Deployment

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=BirdChime
VITE_APP_ENV=production
```

### Build Steps
1. Set production environment variables
2. Run `npm run build`
3. Deploy `dist` folder to hosting service
4. Configure hosting for SPA routing

### Hosting Options
- Vercel (Recommended)
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting
- GitHub Pages (with routing configuration)

## 🤝 Contributing

### Best Practices
- Follow the existing code structure
- Write TypeScript types for new features
- Use React Query for API calls
- Create reusable components
- Keep components modular and focused
- Write clean, self-documenting code
- Test thoroughly before committing

### Code Style
- Use functional components with hooks
- Prefer named exports for components
- Use TypeScript interfaces for props
- Follow Prettier formatting (if configured)
- Use meaningful variable names

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**Issue**: Cannot connect to API
- **Solution**: Verify `VITE_API_BASE_URL` in `.env` is correct
- **Solution**: Ensure backend server is running
- **Solution**: Check CORS configuration on backend

**Issue**: Build fails
- **Solution**: Run `npm install` to ensure all dependencies are installed
- **Solution**: Check Node.js version (must be v18+)
- **Solution**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Issue**: Hot reload not working
- **Solution**: Restart development server
- **Solution**: Clear browser cache
- **Solution**: Check if port 5173 is available

**Issue**: TypeScript errors
- **Solution**: Run `npm run type-check` to see all errors
- **Solution**: Ensure all dependencies are installed
- **Solution**: Check tsconfig.json configuration

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

Built with ❤️ using React, TypeScript, and Vite
