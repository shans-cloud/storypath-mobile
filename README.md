# Welcome to Story Path Player Mode 👋

The StoryPath Player is a mobile application built using React Native, built as a complement to the StoryPath Web application by allowing participants to interact with location-based narratives in real-world contexts via mobile devices. 

The mobile app allows users to:
- View and select from a list of published location-based projects
- Track progress using GPS-based location detection or QR code scanning to unlock and score location visits
- Visualize progress on an interactive map, showing unlocked locations with geofenced radius indicators

Key technical features: 
- React Native + Expo implementation
- Integrated MapView (using expo-location and react-native-maps) to show current position and unlocked markers
- QR Code Scanner using expo-barcode-scanner for real-time location unlocking and scoring
- Data persistence and retrieval via a secure REST API, with scoring and visit tracking recorded through the Tracking endpoint
- Designed using modular functional components and centralized API logic 

## Setting up

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## References

### Hero Image

The hero image used on the home page is sourced from [Pexels](https://www.pexels.com), a free stock photo website.

- **Image:** [Globe with googly eyes](https://www.pexels.com/photo/earth-globe-with-googly-eyes-on-gray-background-5217882/)
- **Photographer:** Anna Shvets

### ChatGPT

ChatGPT was used to help create docstrings.
