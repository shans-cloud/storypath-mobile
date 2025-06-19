import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { getTrackings, createTracking } from "@/services/api";

/**
 * UserContext
 *
 * A React context that provides user-related data and functions, including user information,
 * location tracking, project scores, and tracking management.
 *
 * @context
 *
 * - Used to share user-related state and functionality across the application.
 * - Includes user details, current user location, loading state, and tracking data.
 */
export const UserContext = createContext();

/**
 * UserProvider Component
 *
 * This component wraps the application in a `UserContext.Provider` and provides state and
 * functions for managing user data, location tracking, and project scores. It handles
 * loading user data from AsyncStorage, fetching and updating tracking information, and
 * starting location tracking.
 *
 * @component
 *
 * @param {ReactNode} children - The child components that will have access to the user context.
 *
 * - Initializes user data from AsyncStorage and starts watching the user's location.
 * - Fetches tracking data from the API and updates project scores accordingly.
 * - Provides functions to add a new tracking and update the user's location in real-time.
 * - Uses `expo-location` to request and handle location permissions and updates.
 *
 * @returns {JSX.Element} The UserProvider component wrapping its children with user context.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackings, setTrackings] = useState([]);
  const [projectScores, setProjectScores] = useState({});

  // Load the user data from AsyncStorage when the app starts
  const loadUserData = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem("participant_username");
      if (savedUsername) {
        setUser(savedUsername);
        await fetchTrackings(savedUsername);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trackings for the user and update the project scores
  const fetchTrackings = async (username) => {
    try {
      const trackings = await getTrackings(username);
      setTrackings(trackings);
      updateProjectScores(trackings);
    } catch (error) {
      console.error("Failed to fetch trackings:", error);
    }
  };

  // Update project scores based on trackings
  const updateProjectScores = (trackings) => {
    const scores = {};
    trackings.forEach(({ project_id, points }) => {
      scores[project_id] = (scores[project_id] || 0) + points;
    });
    setProjectScores(scores);
  };

  // Add a new tracking and update state
  const addTracking = async (projectId, locationId, points) => {
    const alreadyTracked = trackings.some(
      (tracking) =>
        tracking.participant_username === user &&
        tracking.project_id === projectId &&
        tracking.location_id === locationId
    );

    // Only track if the location is new
    if (!alreadyTracked) {
      await createTracking({
        project_id: projectId,
        location_id: locationId,
        participant_username: user,
        points,
      });

      // Update local trackings by fetching the latest data
      await fetchTrackings(user);
      console.log("Tracking created and trackings updated.");
    } else {
      console.log("This is a visited location. Not tracked.");
    }
  };

  // Conditionally start watching the user's location
  const startWatchingLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          const userCoordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(userCoordinates);
        }
      );
    } else {
      console.error("Permission to access location was denied");
    }
  };

  // Watch for changes in the user state to restart location tracking
  useEffect(() => {
    if (user) {
      fetchTrackings(user);
      setProjectScores({});
      // Restart location tracking when user changes
      startWatchingLocation();
    }
  }, [user]);

  // Initialize user data and location tracking
  useEffect(() => {
    const initializeUserContext = async () => {
      setLoading(true);
      await loadUserData();
      setLoading(false);
    };
    initializeUserContext();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        userLocation,
        trackings,
        projectScores,
        setUser,
        addTracking,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
