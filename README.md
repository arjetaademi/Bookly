# Bookly — Lash & Brow Appointment Booking App

A modern, responsive appointment booking application designed for lash and brow beauty services. Built with React, Supabase, and EmailJS, Bookly simplifies appointment scheduling for clients and provides a dedicated dashboard for administrators to manage bookings.

## Features

### Client Booking
- Browse available lash and brow services with prices and durations.
- Select a preferred appointment date and time.
- View unavailable time slots to prevent overlapping reservations.
- Enter contact details through a simple four-step booking process.
- Receive an appointment confirmation email.

### Admin Dashboard
- Secure administrator login using Supabase Authentication.
- View and manage customer appointments.
- Access booking information through a dedicated dashboard.
- Restrict administrative access using Supabase Row Level Security (RLS).

### Additional Features
- Responsive design for desktop, tablet, and mobile devices.
- Real-time database queries for booking availability.
- Duplicate booking prevention using database constraints.
- Email notifications powered by EmailJS.
- Form validation and error handling.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface and components |
| JavaScript | Application logic |
| Vite | Development and build tooling |
| CSS3 | Styling and responsive design |
| Supabase | PostgreSQL database and authentication |
| EmailJS | Appointment email notifications |
| Git & GitHub | Version control |
| Netlify | Deployment (planned) |

## How It Works

1. **Choose a Service** — Select a lash or brow treatment.
2. **Select a Date** — Choose a preferred appointment date.
3. **Pick a Time** — Select an available appointment slot.
4. **Confirm Booking** — Enter contact information and submit the reservation.

After successful submission, the booking is stored in Supabase and confirmation emails are sent through EmailJS.

## Getting Started

### Prerequisites

- Node.js
- npm
- A Supabase project
- An EmailJS account

### Installation

Clone the repository:

```bash
git clone https://github.com/arjetaademi/Bookly.git
```

Navigate to the project directory:

```bash
cd Bookly
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and configure:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Start the development server:

```bash
npm run dev
```

**Note:** A configured Supabase database, authentication setup, and EmailJS templates are required for the complete application to work. Never commit private credentials to GitHub.

## Security

- Supabase Row Level Security (RLS) protects database access.
- Administrative routes require authentication.
- Booking availability is protected against duplicate reservations using database constraints.
- Environment variables are used for frontend service configuration.
- Supabase service-role keys and other privileged credentials must remain server-side.

## Future Improvements

- Automated appointment reminders.
- Improved booking analytics for administrators.
- Service and schedule management through the admin dashboard.
- Additional accessibility improvements.

## Author

**Arjeta Ademi**

Frontend Developer

- [GitHub](https://github.com/arjetaademi)
- [Portfolio](https://arjeta-portfolio.netlify.app/)
- [LinkedIn](https://www.linkedin.com/in/arjeta-ademi-a4a768247/)

## License

This project is currently maintained as a personal portfolio project. No open-source license has been specified.
