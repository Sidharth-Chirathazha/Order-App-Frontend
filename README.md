# Order App Frontend

## Overview

This is the frontend for the Order App, built using **React**. It provides a user-friendly interface for selecting products, entering personal information, and placing orders. The frontend communicates with the Django backend via RESTful APIs using **Axios** for HTTP requests. The application is designed to be responsive and intuitive, allowing users to submit orders seamlessly.

## Tech Stack

- **React**: JavaScript library for building the user interface.
- **Vite**: Build tool and development server for fast React development.
- **Axios**: For making API requests to the backend.
- **JavaScript (ES6+)**: Programming language for the frontend.
- **Tailwind CSS** (optional, if used): For styling the application.

## Prerequisites

- Node.js (version 16 or higher)
- npm or Yarn
- Backend server running at `http://localhost:8000` (see backend README for setup)

## Setup Instructions

### 1. Clone the repository:

```bash
git clone https://github.com/Sidharth-Chirathazha/Order-App-Frontend.git
cd frontend
```

### 2. Install dependencies:

```bash
npm install
```

Or, if using Yarn:

```bash
yarn install
```

### 3. Configure the `.env` file:
Create a `.env` file in the project root and add the following environment variable:

```env
VITE_BACKEND_URL=http://localhost:8000
```

- **VITE_BACKEND_URL**: The URL of the Django backend API. Ensure it matches the backend server's address.

### 4. Start the development server:

```bash
npm run dev
```

Or, if using Yarn:

```bash
yarn dev
```

The frontend will be available at `http://localhost:5173`.

## Features

- **Order Form**: Allows users to select products, input personal details, and submit orders.
- **Order Confirmation**: Displays confirmation details after successful order submission.
- **Responsive Design**: Optimized for both desktop and mobile devices.


## Notes

- Ensure the backend server is running before starting the frontend, as API requests depend on it.
- The `VITE_BACKEND_URL` in the `.env` file must match the backend's address to avoid CORS issues.
- If using Tailwind CSS, ensure it's configured in the project (check `tailwind.config.js`).
- Test API connectivity by visiting `http://localhost:8000/api/orders/` in a browser or using a tool like Postman.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
