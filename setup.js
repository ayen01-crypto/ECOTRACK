#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌱 EcoTrack Setup Script');
console.log('========================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Function to run commands
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`📦 Running: ${command}`);
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    return false;
  }
}

// Function to create directory if it doesn't exist
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Function to copy file if it doesn't exist
function copyFileIfNotExists(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`📄 Copied file: ${dest}`);
  }
}

// Main setup function
async function setup() {
  try {
    console.log('\n🚀 Starting EcoTrack setup...\n');

    // 1. Install backend dependencies
    console.log('1️⃣ Installing backend dependencies...');
    if (!runCommand('npm install', './backend')) {
      throw new Error('Failed to install backend dependencies');
    }

    // 2. Install frontend dependencies
    console.log('\n2️⃣ Installing frontend dependencies...');
    if (!runCommand('npm install', './frontend')) {
      throw new Error('Failed to install frontend dependencies');
    }

    // 3. Create .env file for backend
    console.log('\n3️⃣ Setting up environment variables...');
    const envPath = './backend/.env';
    if (!fs.existsSync(envPath)) {
      const envContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecotrack
JWT_SECRET=your_super_secret_jwt_key_here_${Date.now()}
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000`;
      
      fs.writeFileSync(envPath, envContent);
      console.log('📄 Created backend/.env file');
    } else {
      console.log('📄 Backend .env file already exists');
    }

    // 4. Create .env file for frontend
    const frontendEnvPath = './frontend/.env';
    if (!fs.existsSync(frontendEnvPath)) {
      const frontendEnvContent = `REACT_APP_API_URL=http://localhost:5000/api`;
      
      fs.writeFileSync(frontendEnvPath, frontendEnvContent);
      console.log('📄 Created frontend/.env file');
    } else {
      console.log('📄 Frontend .env file already exists');
    }

    // 5. Create necessary directories
    console.log('\n4️⃣ Creating necessary directories...');
    createDir('./backend/logs');
    createDir('./frontend/public/images');

    // 6. Check if MongoDB is running
    console.log('\n5️⃣ Checking MongoDB connection...');
    try {
      execSync('mongosh --eval "db.runCommand({ping: 1})" --quiet', { stdio: 'pipe' });
      console.log('✅ MongoDB is running');
    } catch (error) {
      console.log('⚠️  MongoDB is not running or not accessible');
      console.log('   Please make sure MongoDB is installed and running');
      console.log('   You can start MongoDB with: mongod');
    }

    // 7. Create initial achievements data
    console.log('\n6️⃣ Setting up initial data...');
    const achievementsData = [
      {
        name: "First Steps",
        description: "Log your first activity",
        icon: "fas fa-baby",
        category: "general",
        criteria: {
          type: "count",
          target: 1,
          timeframe: "all-time",
          activityType: "any"
        },
        points: 10,
        rarity: "common"
      },
      {
        name: "Green Commuter",
        description: "Use eco-friendly transportation for 30 days",
        icon: "fas fa-bicycle",
        category: "transportation",
        criteria: {
          type: "streak",
          target: 30,
          timeframe: "daily",
          activityType: "transportation"
        },
        points: 50,
        rarity: "uncommon"
      },
      {
        name: "Energy Saver",
        description: "Reduce energy consumption by 20%",
        icon: "fas fa-plug",
        category: "energy",
        criteria: {
          type: "reduction",
          target: 20,
          timeframe: "monthly",
          activityType: "energy"
        },
        points: 75,
        rarity: "rare"
      }
    ];

    const achievementsPath = './backend/data/achievements.json';
    createDir('./backend/data');
    fs.writeFileSync(achievementsPath, JSON.stringify(achievementsData, null, 2));
    console.log('📄 Created initial achievements data');

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Make sure MongoDB is running: mongod');
    console.log('   2. Start the backend server: cd backend && npm run dev');
    console.log('   3. Start the frontend server: cd frontend && npm start');
    console.log('   4. Open http://localhost:3000 in your browser');
    console.log('\n🔧 Development commands:');
    console.log('   Backend:  cd backend && npm run dev');
    console.log('   Frontend: cd frontend && npm start');
    console.log('   Build:    cd frontend && npm run build');
    console.log('\n📚 Documentation: See README.md for detailed information');
    console.log('\n🌱 Happy coding with EcoTrack!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure you have Node.js 16+ installed');
    console.log('   2. Make sure you have npm installed');
    console.log('   3. Check your internet connection');
    console.log('   4. Try running the setup again');
    process.exit(1);
  }
}

// Run setup
setup();
