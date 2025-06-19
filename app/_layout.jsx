import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getLocations } from "@/services/api";
import { UserProvider } from "@/components/context/UserContext";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import CustomDrawerHeader from "@/components/CustomDrawerHeader";
import Feather from "@expo/vector-icons/Feather";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";

// Import screens
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import ProjectList from "./screens/ProjectList";
import ProjectHome from "./screens/project/ProjectHome";
import Map from "./screens/project/Map";
import QRScanner from "./screens/project/QRScanner";
import LocationDetail from "./screens/project/LocationDetail";
import VisitedLocations from "./screens/project/VisitedLocations";
import CustomHeaderTitle from "@/components/CustomHeaderTitle";

// Create the navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * ProjectTabNavigator Component
 *
 * A tab navigator for displaying project-specific screens, including the Project Home, Map, and QR Scanner tabs.
 * This component fetches and manages project locations.
 *
 * @param {object} route - The navigation route object containing parameters, such as the project details.
 * @returns {JSX.Element} The tab navigator.
 */
function ProjectTabNavigator({ route }) {
  const { project } = route.params;
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch locations when tapping on project
  useEffect(() => {
    const fetchProjectLocations = async () => {
      try {
        const fetchedLocations = await getLocations(project.id);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectLocations();
  }, [project.id]);

  // Show loading indicator while fetching locations
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#FB8500",
        tabBarInactiveTintColor: "#cfbfa1",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#f0f0f0",
        },
      }}
    >
      <Tab.Screen
        name="Project Home"
        component={ProjectHome}
        initialParams={{ project, locations }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
          title: "Home",
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        initialParams={{ project, locations }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" color={color} size={size} />
          ),
          title: "Map",
        }}
      />
      <Tab.Screen
        name="QR Scanner"
        component={QRScanner}
        initialParams={{ project, locations }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="camera" color={color} size={size} />
          ),
          title: "Scanner",
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * ProjectStackNavigator Component
 *
 * A stack navigator that manages navigation between the Pproject List screen and Project Details, including
 * individual project tabs and visited locations.
 *
 * @returns {JSX.Element} The stack navigator for handling project navigation.
 */
function ProjectStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#219EBC",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Project List"
        component={ProjectList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Project Details"
        component={ProjectTabNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
          const titleMap = {
            "Project Home": "Project",
            Map: "Map",
            "QR Scanner": "QR Scanner",
          };
          return {
            headerTitle: () => (
              <CustomHeaderTitle title={titleMap[routeName] || "Project"} />
            ),
            headerBackTitle: "Back",
          };
        }}
      />
      <Stack.Screen
        name="Visited Locations"
        component={VisitedLocations}
        options={{
          headerTitle: () => <CustomHeaderTitle title="Visited Locations" />,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen name="Location Detail" component={LocationDetail} />
    </Stack.Navigator>
  );
}

/**
 * AppLayout Component
 *
 * The main layout component for the application, providing a drawer navigator for broader navigation between
 * sections such as Home, Profile, and Projects. It wraps the app in a `UserProvider` context to manage
 * user-related data throughout the application.
 *
 * - Loads custom fonts using Expo's `useFonts` hook and hides the splash screen once fonts are loaded.
 *
 * @returns {JSX.Element} The main layout component with a drawer navigator for navigating the app.
 */
export default function AppLayout() {
  const [loaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <UserProvider>
      <Drawer.Navigator
        initialRouteName="screens/Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#8ECAE6",
          },
          headerTintColor: "white",
        }}
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
            <CustomDrawerHeader />
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen
          name="screens/Home"
          component={Home}
          options={{
            title: "Home",
            headerTitle: () => <CustomHeaderTitle title="HOME" />,
          }}
        />
        <Drawer.Screen
          name="screens/Profile"
          component={Profile}
          options={{
            title: "Profile",
            headerTitle: () => <CustomHeaderTitle title="PROFILE" />,
          }}
        />
        <Drawer.Screen
          name="screens/ProjectList"
          component={ProjectStackNavigator}
          options={{
            title: "Projects",
            headerTitle: () => <CustomHeaderTitle title="PROJECTS" />,
          }}
        />
      </Drawer.Navigator>
    </UserProvider>
  );
}
