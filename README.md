# EcoTrack - Carbon Footprint Tracking Application

A modern, full-stack web application for tracking and reducing carbon footprint. Built with React frontend and Node.js/Express backend with MongoDB database.

## 🌱 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Carbon Footprint Calculator**: Comprehensive calculator for transportation, energy, food, and waste
- **Activity Logging**: Track daily activities and their environmental impact
- **Dashboard**: Visual analytics with charts and insights
- **Achievements System**: Gamified experience with badges and milestones
- **Real-time Data**: Live updates and synchronization between frontend and backend

### Technical Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Dark/Light Theme**: User preference support
- **Data Visualization**: Interactive charts using Chart.js
- **Real-time Updates**: Live data synchronization
- **Secure API**: Protected routes with authentication middleware
- **Data Validation**: Comprehensive input validation and error handling

## 🏗️ Project Structure

```
ecotrack/
├── backend/                 # Node.js/Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── config.env          # Environment variables
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   └── public/             # Static assets
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecotrack
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```bash
   cd ../backend
   cp config.env .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecotrack
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Activities
- `GET /api/activities` - Get user activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/stats/footprint` - Get footprint statistics

### Calculator
- `POST /api/calculator/footprint` - Calculate carbon footprint
- `GET /api/calculator/factors` - Get carbon factors
- `GET /api/calculator/transportation` - Get transportation options
- `GET /api/calculator/diet` - Get diet options

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/user` - Get user achievements
- `POST /api/achievements/check` - Check for new achievements
- `GET /api/achievements/stats` - Get achievement statistics

### Users
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/stats` - Get user statistics

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  fullName: String,
  carbonFootprint: {
    total: Number,
    transportation: Number,
    energy: Number,
    food: Number,
    waste: Number
  },
  achievements: [ObjectId],
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Model
```javascript
{
  userId: ObjectId,
  type: String, // transportation, energy, food, waste
  category: String,
  description: String,
  value: Number,
  unit: String,
  carbonFootprint: Number,
  date: Date,
  location: Object,
  metadata: Object
}
```

### Achievement Model
```javascript
{
  name: String,
  description: String,
  icon: String,
  category: String,
  criteria: {
    type: String,
    target: Number,
    unit: String,
    timeframe: String
  },
  points: Number,
  rarity: String
}
```

## 🎨 Frontend Components

### Key Components
- **Navbar**: Navigation with authentication state
- **Dashboard**: Main user dashboard with charts
- **Calculator**: Carbon footprint calculator
- **Activities**: Activity logging and management
- **Achievements**: Achievement display and progress
- **Profile**: User profile management

### Styling
- **Styled Components**: CSS-in-JS for component styling
- **Responsive Design**: Mobile-first approach
- **Theme Support**: Dark/light mode toggle
- **Modern UI**: Clean, accessible interface

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Start development server
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and start the server
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve static files with a web server
3. Configure API endpoints for production

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
```

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Progressive Web App (PWA) capabilities

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive validation on all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet.js**: Security headers middleware

## 🌍 Carbon Calculation Factors

The application uses scientifically-backed carbon emission factors:

### Transportation
- Car (petrol): 0.192 kg CO2/km
- Car (diesel): 0.171 kg CO2/km
- Car (hybrid): 0.120 kg CO2/km
- Car (electric): 0.053 kg CO2/km
- Bus: 0.089 kg CO2/km
- Train: 0.041 kg CO2/km
- Plane: 0.285 kg CO2/km

### Energy
- Electricity: 0.5 kg CO2/kWh
- Natural Gas: 0.202 kg CO2/kWh
- Heating Oil: 0.267 kg CO2/kWh

### Food
- Meat Daily: 2.5 tons CO2/year
- Average Diet: 1.8 tons CO2/year
- Vegetarian: 1.2 tons CO2/year
- Vegan: 0.9 tons CO2/year

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **ARYATUHA KENNETH ADONIS** - Lead Developer
- **AYEN GEOFFREY ALEXANDER** - Co-Developer
- **AIJUKIRE GILBERT G-TECH** - Sustainability Expert
- **KULABAKO ARNOLD ODONGO** - Data Analyst
- **TURYAHABWE PATIENCE** - Data Analyst

## 📞 Support

For support and questions:
- Email: kennetharyatuha@gmail.com
- Phone: +256749537430 / +256394785202 / +256785488123
- Location: Kabale University, Kikungiri Hill

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication
  - Carbon footprint calculator
  - Activity logging
  - Dashboard with charts
  - Achievements system
  - Responsive design

---

**EcoTrack** - Making environmental awareness accessible and actionable for everyone. 🌱
