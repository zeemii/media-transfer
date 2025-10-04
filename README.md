# Media Transfer - React Native App

A React Native mobile application for backing up and transferring your photos and videos safely.

## Features

- 📱 Cross-platform (iOS & Android)
- 📷 Select photos and videos from device gallery
- 💾 Backup media files to secure storage
- 📊 Real-time backup progress tracking
- 🔒 Secure file handling with proper permissions
- 🎨 Clean and intuitive user interface

## Prerequisites

Before running this app, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development - macOS only)

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd media-transfer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS (macOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### Android
```bash
npm run android
```

### iOS (macOS only)
```bash
npm run ios
```

### Start Metro bundler (if not started automatically)
```bash
npm start
```

## App Structure

```
src/
├── App.js                 # Main app component with navigation
└── screens/
    ├── HomeScreen.js      # Landing screen with main actions
    ├── MediaPickerScreen.js # Media selection interface
    └── BackupScreen.js    # Backup progress and management
```

## Usage

1. **Home Screen**: The main landing screen with options to select media or view backups
2. **Select Media**: Choose photos and videos from your device gallery
3. **Backup Process**: Monitor backup progress and manage your media files

## Permissions

The app requires the following permissions:
- Camera access (for taking new photos)
- Storage access (for reading/writing media files)
- Internet access (for future cloud backup features)

## Development

### Adding New Features

1. Create new screen components in `src/screens/`
2. Add navigation routes in `src/App.js`
3. Install additional dependencies as needed

### Building for Production

#### Android
```bash
cd android
./gradlew assembleRelease
```

#### iOS
Use Xcode to archive and distribute the app.

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **Android build errors**: Clean and rebuild with `cd android && ./gradlew clean && cd ..`
3. **Permission errors**: Ensure all required permissions are granted in device settings

### Dependencies

This app uses the following key libraries:
- `@react-navigation/native` - Navigation
- `react-native-image-picker` - Media selection
- `react-native-fs` - File system operations
- `react-native-permissions` - Permission handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For beginners getting started with React Native:
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Tutorial](https://reactnative.dev/docs/tutorial)
- [Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)
