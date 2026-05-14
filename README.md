# LearnSphere - Mini LMS Mobile App

A comprehensive React Native Expo application demonstrating modern mobile development practices, featuring authentication, course catalog, WebView integration, and native features.

## 🚀 Features

### Core Functionality
- **User Authentication**: Login/Register with secure token storage
- **Course Catalog**: Browse courses with instructors, search, and bookmarking
- **WebView Integration**: Embedded course content viewer
- **Native Features**: Local notifications for engagement
- **State Management**: Global state with persistent storage
- **Performance Optimization**: LegendList with memoization
- **Error Handling**: Retry mechanisms, offline mode, user-friendly errors

### Technical Highlights
- TypeScript with strict mode enabled
- Expo Router for navigation
- NativeWind (TailwindCSS) for styling
- Expo SecureStore for sensitive data
- AsyncStorage for app data
- Expo Notifications for native features
- React Hook Form with Zod validation

## 🛠️ Tech Stack

- **Framework**: React Native Expo SDK 54
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router
- **Styling**: NativeWind
- **State Management**: React Context + AsyncStorage
- **Authentication**: JWT tokens with SecureStore
- **Lists**: LegendList for performance
- **Forms**: React Hook Form + Zod
- **API**: RESTful with retry logic
- **Notifications**: Expo Notifications

## 📋 Prerequisites

- Node.js 20.x
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learnsphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - For Android: `npx expo start --android`
   - For iOS: `npx expo start --ios`
   - For web: `npx expo start --web`

## 🔧 Environment Variables

No environment variables are required. The app uses the public API at `https://api.freeapi.app/api/v1/`.

## 🏗️ Architecture Decisions

### State Management
- **Authentication**: Context + SecureStore for tokens
- **Courses**: Context + AsyncStorage for persistence
- **Global State**: React Context for app-wide state management

### Data Persistence
- **Secure Data**: Expo SecureStore (auth tokens)
- **App Data**: AsyncStorage (courses, bookmarks, preferences)
- **Caching**: API responses cached locally for offline access

### Performance Optimizations
- **List Rendering**: LegendList with estimated item sizes
- **Memoization**: React.memo for list items
- **Image Caching**: Expo Image with built-in caching
- **Lazy Loading**: Components load data on demand

### Error Handling
- **Network Errors**: Automatic retry with exponential backoff
- **API Failures**: User-friendly error messages
- **Offline Mode**: Graceful degradation with cached data
- **WebView Errors**: Fallback UI for failed loads

### Security
- **Token Storage**: SecureStore for JWT tokens
- **Input Validation**: Zod schemas for form validation
- **API Security**: Bearer token authentication

## 📱 App Structure

```
app/
├── _layout.tsx          # Root layout with providers
├── (auth)/              # Authentication screens
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/              # Main app tabs
│   ├── _layout.tsx
│   ├── index.tsx        # Course catalog
│   └── profile.tsx      # User profile
├── course/[id].tsx      # Course details
└── webview.tsx          # Course content viewer

contexts/
├── AuthContext.tsx      # Authentication state
└── CourseContext.tsx    # Courses and bookmarks

services/
├── api.ts              # API client with retry logic
└── notifications.ts    # Notification service

types/
└── index.ts            # TypeScript interfaces
```

## 🔄 API Integration

The app integrates with the following endpoints:

- `GET /api/v1/public/randomusers` - Course instructors
- `GET /api/v1/public/randomproducts` - Course catalog
- `POST /api/v1/users/login` - User authentication
- `POST /api/v1/users/register` - User registration
- `GET /api/v1/users/me` - User profile (with auth token)

## 📢 Notifications

- **Bookmark Milestone**: Triggers when user bookmarks 5+ courses
- **Reminder**: Scheduled 24 hours after last app usage
- **Permission**: Requested on app launch

## 🛠️ Build Instructions

### Development Build
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure for development builds
eas build:configure

# Build for Android
eas build --platform android --profile development

# Build for iOS
eas build --platform ios --profile development
```

### APK Generation
```bash
# Create APK for Android
eas build --platform android --profile production
```

The APK will be available in the EAS dashboard and can be downloaded from the releases section.

## 🐛 Known Issues & Limitations

1. **API Dependency**: Relies on external API availability
2. **WebView Content**: Course content is currently static HTML
3. **Offline Sync**: Limited offline functionality for dynamic content
4. **Image Loading**: Some instructor avatars may fail to load
5. **Notification Timing**: Reminder notifications may not work perfectly on all devices

## 📸 Screenshots

### Authentication
- Login/Register screens with form validation

### Course Catalog
- Course list with search and bookmark functionality
- Pull-to-refresh and infinite scroll

### Course Details
- Detailed course information with enrollment
- Instructor profiles and course metadata

### Profile Screen
- User statistics and bookmarked courses
- Settings and account management

### WebView Content
- Embedded course content viewer
- Progress tracking and navigation

## 🎥 Demo Video

A 3-5 minute walkthrough demonstrating:
- User registration and login
- Course browsing and search
- Bookmarking functionality
- WebView content viewing
- Notification features
- Offline mode behavior
- Profile management

*Demo video available in repository assets*

## 🔒 Security Considerations

- JWT tokens stored securely in SecureStore
- Input validation on all forms
- HTTPS-only API communication
- No sensitive data logging
- Secure random token generation

## 🚀 Performance Features

- Fast list rendering with LegendList
- Image caching and optimization
- Lazy loading of course data
- Memoized components
- Efficient state updates
- Background notification scheduling

## 📈 Future Enhancements

- Real course content management
- Video streaming integration
- Advanced search filters
- Social features (comments, ratings)
- Push notifications for course updates
- Offline video downloading
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built as part of React Native Developer Assignment showcasing modern mobile development practices.