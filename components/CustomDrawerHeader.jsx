import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "@/components/context/UserContext";

/**
 * CustomDrawerHeader Component
 *
 * This component renders a custom header for a drawer navigation menu. It displays the user's profile photo
 * and username, which are loaded from `AsyncStorage` and the `UserContext`. If no photo is available, it shows
 * a placeholder view with a prompt to add a photo. If the user is not logged in, a message is displayed to
 * encourage registration.
 *
 * @component
 *
 * - Uses `AsyncStorage` to load the user's profile photo when the component mounts.
 * - Accesses the user's name from the `UserContext` and displays it.
 * - If a photo is not available, a placeholder with a text prompt is displayed.
 *
 * @returns {JSX.Element} The custom drawer header with the user's photo and name or default placeholders.
 */
const CustomDrawerHeader = () => {
  const { user } = useContext(UserContext); // Get username from context
  const [photo, setPhoto] = useState(null); // Local state for photo

  useEffect(() => {
    // Load the profile photo from AsyncStorage
    const loadProfilePhoto = async () => {
      try {
        const savedPhoto = await AsyncStorage.getItem("participant_photo");
        if (savedPhoto) setPhoto(savedPhoto);
      } catch (error) {
        console.error("Failed to load photo:", error);
      }
    };

    loadProfilePhoto();
  }, []);

  return (
    <View className="p-5 items-center ">
      {photo ? (
        <Image
          source={{ uri: photo }}
          className="w-20 h-20 rounded-full mb-2"
        />
      ) : (
        <View className="w-20 h-20 rounded-full bg-gray-300 justify-center items-center mb-2">
          <Text className="text-white">Add Photo</Text>
        </View>
      )}
      {/* Show username if present, otherwise encourage users to register */}
      {user ? (
        <Text className="mt-5 text-primary-dark text-2xl font-pbold text-center">
          {user}
        </Text>
      ) : (
        <Text className="mt-5 text-primary font-light text-center">
          Register and track your scores
        </Text>
      )}
    </View>
  );
};

export default CustomDrawerHeader;
