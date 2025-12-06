# Setup Instructions

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update `EXPO_PUBLIC_API_BASE_URL` with your backend API URL
   - For local development: `http://localhost:5000/api`
   - For physical device: `http://YOUR_LOCAL_IP:5000/api`

3. **Create required assets:**
   - See `assets/README.md` for required image files
   - For development, placeholder images will work

## Running the App

### Development Server
```bash
npx expo start
```

### iOS Simulator
```bash
npx expo start --ios
```

### Android Emulator
```bash
npx expo start --android
```

### Physical Device
1. Install Expo Go app on your device
2. Scan the QR code from the terminal
3. Make sure your device and computer are on the same network

## Project Structure

```
/
├── App.js                 # Main entry point
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── stores/           # Zustand state management
│   ├── services/         # API and service layers
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utilities and constants
├── assets/               # Images and static assets
└── package.json          # Dependencies
```

## Key Features

- ✅ User authentication (Login/Register)
- ✅ Intake logging with offline support
- ✅ Real-time analytics and charts
- ✅ AI-powered coaching and insights
- ✅ Push notifications
- ✅ Offline data persistence

## Troubleshooting

### Common Issues

1. **Metro bundler errors:**
   - Clear cache: `npx expo start -c`
   - Delete `node_modules` and reinstall

2. **Navigation errors:**
   - Ensure `react-native-gesture-handler` is properly installed
   - Check that all navigation dependencies are up to date

3. **API connection issues:**
   - Verify backend is running
   - Check `.env` file configuration
   - For physical device, use local IP instead of localhost

4. **Build errors:**
   - Ensure all required assets are in `assets/` directory
   - Check `app.json` configuration

## Next Steps

1. Connect to your backend API
2. Configure push notifications (Expo project ID)
3. Add app icons and splash screens
4. Test on physical devices
5. Configure EAS Build for production

