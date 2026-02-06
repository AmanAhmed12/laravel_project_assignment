# Video E-Commerce Platform

A robust video e-commerce platform built with Laravel (Backend) and Next.js (Frontend).

## Features Implemented

- [x] **Public Home Page**: Browse and preview uploaded videos.
- [x] **Admin Authentication**: Secure login system for administrators.
- [x] **Admin Dashboard**: Manage video content (List, Delete).
- [x] **Video Upload System**: Direct video upload handling (Admin only).
- [x] **Responsive UI**: Built with Tailwind CSS for mobile and desktop.
- [x] **Database**: MySQL integration with migrations and seeders.

## Setup Instructions

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & npm
- MySQL Server

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy `.env.example` to `.env` and configure your database:
   ```bash
   cp .env.example .env
   # Update DB_DATABASE=video_ecommerce, DB_USERNAME, DB_PASSWORD
   ```
4. Generate application key:
   ```bash
   php artisan key:generate
   ```
5. Run migrations and seed data (creates Admin user):
   ```bash
   php artisan migrate --seed
   ```
6. Link storage:
   ```bash
   php artisan storage:link
   ```
7. Start the server:
   ```bash
   php artisan serve
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Default Credentials
- **Admin Email**: `admin@example.com`
- **Password**: `password`

## Technology Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Laravel 11, Sanctum, MySQL
# laravel_project_assignment