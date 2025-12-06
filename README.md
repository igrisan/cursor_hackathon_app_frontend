# cursor-hackathon-app-mobile
---

# 🚀 SmokeLess AI — Mobile App (React Native)

Cross-platform AI-powered mobile application that helps users track and reduce smoking/vaping habits with real-time analytics, craving predictions, and personalized coaching.

---

# 📌 Project Overview

This is the **Mobile App** companion to the SmokeLess AI backend system.
The mobile app provides:

* Native iOS & Android experience
* User authentication & profile management
* Quick manual vape/smoke intake logging
* Real-time analytics dashboards
* AI-powered insights visualization
* Personalized habit reduction coaching interface
* Push notifications for craving predictions
* Offline data persistence

---

# ⚙️ Tech Stack

**Framework:** React Native (Expo)
**Navigation:** React Navigation v6
**State Management:** Zustand
**UI Library:** React Native Paper + NativeBase
**Charts:** React Native Chart Kit / Victory Native
**HTTP Client:** Axios
**Forms:** React Hook Form + Zod validation
**Date Handling:** DayJS
**Local Storage:** AsyncStorage
**Notifications:** Expo Notifications

---

# 📦 Mobile Dependencies (Strict List — No Deviations)

These should be installed exactly as listed for consistency:

## Core

```
expo
expo-status-bar
react-native
react-native-safe-area-context
react-native-screens
```

## Navigation

```
@react-navigation/native
@react-navigation/native-stack
@react-navigation/bottom-tabs
@react-navigation/drawer
```

## State & Data

```
zustand
axios
@tanstack/react-query
@react-native-async-storage/async-storage
```

## UI Components

```
react-native-paper
native-base
react-native-vector-icons
expo-linear-gradient
```

## Forms & Validation

```
react-hook-form
zod
@hookform/resolvers
```

## Charts & Analytics

```
react-native-chart-kit
react-native-svg
victory-native
```

## Notifications

```
expo-notifications
expo-device
```

## Utilities

```
dayjs
expo-haptics
expo-secure-store
```

## Dev Tools

```
@babel/core
eslint
prettier
```

---

# 🏗️ Mobile App Architecture

```
/src
  /components
    /common          # Button, Card, Input, Modal
    /intake          # IntakeLogger, IntakeHistoryItem, QuickLogButton
    /analytics       # DailyChart, WeeklyTrends, UsageHeatMap
    /ai              # InsightCard, CoachingPanel, CravingAlert
  /screens
    /Auth            # LoginScreen, RegisterScreen
    /Main            # DashboardScreen, TabNavigator
    /Analytics       # AnalyticsScreen, TrendsScreen
    /Coach           # CoachScreen, TipsScreen
    /Profile         # ProfileScreen, SettingsScreen
  /navigation
    AuthNavigator.js
    AppNavigator.js
    TabNavigator.js
  /stores
    authStore.js
    intakeStore.js
    analyticsStore.js
    notificationStore.js
  /services
    api.js           # Axios instance + interceptors
    auth.service.js
    intake.service.js
    analytics.service.js
    ai.service.js
    notification.service.js
    storage.service.js
  /hooks
    useAuth.js
    useIntake.js
    useAnalytics.js
    useNotifications.js
  /utils
    constants.js
    helpers.js
    theme.js
  /assets
    /images
    /icons
```

---

# 📱 Core Screens & Navigation

## Auth Stack

* `LoginScreen` - User login with email/password
* `RegisterScreen` - User registration

## Main Tab Navigator

* `DashboardScreen` - Overview + quick log (Home tab)
* `AnalyticsScreen` - Detailed charts & trends (Analytics tab)
* `CoachScreen` - AI coaching interface (Coach tab)
* `ProfileScreen` - User profile & settings (Profile tab)

## Modal/Overlay Screens

* `IntakeLoggerModal` - Full-screen intake logging
* `CravingAlertModal` - Prediction warnings
* `TipDetailModal` - Expanded coaching tips

---

# 🎨 Key Mobile Components

## QuickLogButton (Floating Action Button)
- Fixed position FAB
- Opens IntakeLoggerModal
- Haptic feedback on press

## IntakeLoggerModal
- Puff count picker (native iOS/Android wheel)
- Intensity segmented control
- Context chip selection
- Notes text input
- Timestamp display
- Submit with validation

## DashboardCard
- Today's usage summary with progress ring
- Weekly comparison badge
- Next craving prediction countdown
- Latest AI insight preview

## Analytics Visualizations
- Daily usage line chart (scrollable)
- Weekly bar chart with gestures
- Hour-of-day heat map grid
- Context breakdown donut chart
- 7-day trend sparkline

## CoachingPanel
- Swipeable tip cards
- Animated progress indicators
- Daily target tracker
- Craving management strategies
- Celebration animations

## CravingAlert (Push Notification + In-App)
- Native notification with actions
- In-app banner with coping strategies
- Quick distraction timer
- Log craving resistance

---

# 🎯 Tasks Split for 4 Developers (No Overlap)

---

# 👤 **Developer 1 — Core Setup + Auth Lead**

### Responsibilities

* Expo project initialization
* Navigation structure (React Navigation)
* Auth screens (Login/Register)
* Auth store (Zustand)
* API service configuration (Axios)
* JWT token management (SecureStore)
* Splash screen & app icon
* Global theme configuration
* Protected route handling

### Deliverables

* `App.js`
* `src/navigation/`
* `src/screens/Auth/`
* `src/stores/authStore.js`
* `src/services/api.js`
* `src/services/storage.service.js`
* `app.json` configuration

---

# 👤 **Developer 2 — Intake Logging UI Lead**

### Responsibilities

* IntakeLoggerModal component
* Intake history list (FlatList)
* Form validation (React Hook Form + Zod)
* Intake store
* QuickLogButton (FAB)
* Swipe-to-delete functionality
* Pull-to-refresh
* Haptic feedback integration
* Offline queue for failed submissions

### Deliverables

* `src/components/intake/IntakeLoggerModal.jsx`
* `src/components/intake/IntakeHistoryItem.jsx`
* `src/components/intake/QuickLogButton.jsx`
* `src/stores/intakeStore.js`
* `src/services/intake.service.js`

---

# 👤 **Developer 3 — Analytics Dashboard Lead**

### Responsibilities

* Analytics screen layout
* Chart library integration (Victory Native)
* Daily/weekly/monthly chart components
* Usage heatmap visualization
* Trend indicators with animations
* Analytics store
* Data fetching hooks
* Chart gesture handling (zoom/pan)
* Export data functionality

### Deliverables

* `src/screens/AnalyticsScreen.jsx`
* `src/components/analytics/DailyChart.jsx`
* `src/components/analytics/WeeklyTrends.jsx`
* `src/components/analytics/UsageHeatMap.jsx`
* `src/stores/analyticsStore.js`

---

# 👤 **Developer 4 — AI Interface + Notifications Lead**

### Responsibilities

* AI insights card component
* Coaching screen UI
* Craving prediction display
* Push notification setup (Expo Notifications)
* Notification permission handling
* Local notification scheduling
* AI service integration
* Motivational content display
* Animated tip cards
* Progress celebration effects

### Deliverables

* `src/components/ai/InsightCard.jsx`
* `src/components/ai/CoachingPanel.jsx`
* `src/components/ai/CravingAlert.jsx`
* `src/services/ai.service.js`
* `src/services/notification.service.js`
* `src/screens/CoachScreen.jsx`

---

# 🚀 Run Instructions

## Development

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run on physical device (scan QR code in Expo Go app)
```

## Environment Configuration

Create `.env` file:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
EXPO_PUBLIC_APP_NAME=SmokeLess AI
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
```

For physical device testing with local backend:
```
EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:5000/api
```

---

# 📱 Build & Deploy

## EAS Build (Expo Application Services)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## App Store Configuration

**iOS (App Store Connect):**
- Bundle ID: `com.yourcompany.smokeless`
- Version: 1.0.0
- Minimum iOS: 13.0

**Android (Google Play Console):**
- Package name: `com.yourcompany.smokeless`
- Version code: 1
- Minimum SDK: 21 (Android 5.0)

---

# 🎨 Design System

## Color Palette

```javascript
const colors = {
  primary: '#3B82F6',      // Blue
  success: '#10B981',      // Green
  warning: '#F59E0B',      // Amber
  danger: '#EF4444',       // Red
  neutral: '#6B7280',      // Gray
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  }
};
```

## Typography

```javascript
const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '600' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
};
```

## Spacing

Use consistent spacing scale (8px base unit):
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

---

# 📊 State Management Strategy

## Auth Store
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (credentials) => {},
  logout: async () => {},
  updateProfile: async (data) => {},
  loadStoredAuth: async () => {}
}
```

## Intake Store
```javascript
{
  logs: [],
  offlineQueue: [],
  isLogging: false,
  addLog: async (data) => {},
  deleteLog: async (id) => {},
  fetchLogs: async () => {},
  syncOfflineQueue: async () => {}
}
```

## Notification Store
```javascript
{
  pushToken: null,
  permissions: null,
  scheduledNotifications: [],
  registerForPushNotifications: async () => {},
  scheduleCravingAlert: async (time) => {},
  clearAllNotifications: async () => {}
}
```

---

# 📲 Push Notification Strategy

## Notification Types

1. **Craving Prediction Alerts**
   - Triggered based on AI prediction engine
   - Scheduled 10-15 minutes before predicted craving time
   - Includes coping strategies

2. **Daily Check-in Reminders**
   - Morning motivation (9 AM)
   - Evening reflection (8 PM)

3. **Milestone Celebrations**
   - 24 hours smoke-free
   - 7 days smoke-free
   - 30 days smoke-free

4. **Coach Tips**
   - Personalized daily tips
   - Random encouragement

## Implementation

```javascript
// Schedule craving alert
await scheduleCravingNotification({
  time: predictedCravingTime,
  title: "Craving Alert",
  body: "You might experience a craving soon. Here's what to do...",
  data: { type: 'craving_prediction' }
});
```

---

# 💾 Offline Support

## Data Persistence Strategy

1. **Local Cache** (AsyncStorage)
   - Last 30 days of intake logs
   - User profile data
   - Latest analytics snapshot

2. **Offline Queue**
   - Store failed API calls
   - Sync when connection restored
   - Show pending indicator in UI

3. **Read-Only Mode**
   - View cached analytics
   - Display offline indicator
   - Queue new logs for sync

---

# 🧪 Testing Requirements

## Unit Tests
```bash
npm test
```

## E2E Tests (Detox)
```bash
npm run test:e2e:ios
npm run test:e2e:android
```

Test coverage:
- Auth flow (login/register/logout)
- Intake logging flow
- Offline mode behavior
- Navigation flows
- Push notification handling

---

# 🗂️ Milestones (For Hackathon Execution)

### **Day 1:**
* Expo setup + navigation structure
* Auth screens + API integration
* Basic theme & components

### **Day 2:**
* Intake logging interface
* Dashboard layout
* Analytics charts
* Push notification setup

### **Day 3:**
* AI coaching interface
* Offline support
* Final polish + testing
* Build & deploy to TestFlight/Play Console

---

# 📱 Device Testing Checklist

- [ ] iPhone (iOS 15+)
- [ ] iPad (tablet layout)
- [ ] Android phone (Android 10+)
- [ ] Android tablet
- [ ] Notch/island devices
- [ ] Small screens (iPhone SE)
- [ ] Large screens (iPhone Pro Max)
- [ ] Dark mode support
- [ ] Landscape orientation
- [ ] Accessibility (VoiceOver/TalkBack)

---

# 🔒 Security Considerations

- Store JWT in SecureStore (encrypted)
- Never log sensitive data
- Validate all user inputs
- Use HTTPS for all API calls
- Implement certificate pinning for production
- Handle biometric authentication (Face ID/Touch ID)

---

# 📘 License

MIT

---
