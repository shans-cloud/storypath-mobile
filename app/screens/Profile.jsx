import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "@/components/context/UserContext";
import CustomButton from "@/components/CustomButton";

/**
 * Profile Component
 *
 * This component allows users to edit their profile information, including their username and profile photo.
 * It integrates with the `UserContext` to manage user data and uses `AsyncStorage` to persist the data.
 * Users can select a photo from their device's gallery, update their username, and save changes.
 *
 * @component
 *
 * - Uses `expo-image-picker` to handle photo selection from the user's device.
 * - Saves and retrieves the user's profile photo and username using `AsyncStorage`.
 * - Provides the ability to remove the selected photo or update the username.
 * - Displays a loading state while the user data is being loaded from context.
 *
 * @returns {JSX.Element} The profile editing screen, including an image picker, text input for the username, and a save button.
 */
const Profile = () => {
  const { user, setUser, loading } = useContext(UserContext); // Use UserContext for username
  const [photo, setPhoto] = useState(null);

  // Load saved username and photo from AsyncStorage on mount
  useState(() => {
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

  // Save username and photo to AsyncStorage
  const saveProfileData = async (newUsername, newPhoto) => {
    try {
      if (newUsername !== null) {
        setUser(newUsername); // Update the context state
        await AsyncStorage.setItem("participant_username", newUsername);
      }
      if (newPhoto !== null) {
        await AsyncStorage.setItem("participant_photo", newPhoto);
      }
    } catch (error) {
      console.error("Failed to save profile data:", error);
    }
  };

  // Handle photo selection
  const handlePhotoChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedPhotoUri = result.assets[0].uri;
      setPhoto(selectedPhotoUri);
      await saveProfileData(null, selectedPhotoUri);
    }
  };

  // Handle username change
  const handleUsernameChange = (text) => {
    setUser(text); // Update context state
  };

  // Save profile data when user presses 'Save'
  const handleSavePress = async () => {
    try {
      // Save the username to AsyncStorage
      await saveProfileData(user, null);
      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  // Handle photo removal
  const handlePhotoRemove = async () => {
    setPhoto(null);
    await saveProfileData(null, "");
  };

  // Loading state if context is still loading
  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 mt-5">
      <Text className="text-3xl font-pbold text-center">Edit Profile</Text>
      <TouchableOpacity onPress={handlePhotoChange} className="mb-2 p-5">
        {photo ? (
          <Image source={{ uri: photo }} className="w-full h-72 rounded-3xl" />
        ) : (
          <View className="w-full h-72 rounded-3xl bg-gray-300 justify-center items-center">
            <Text className="text-gray-600 text-lg">Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>
      {photo && <Button title="Remove Photo" onPress={handlePhotoRemove} />}
      <TextInput
        className="h-12 border border-gray-300 rounded-3xl px-3 my-5 m-5"
        placeholder="Enter Username"
        value={user}
        onChangeText={handleUsernameChange}
      />
      <CustomButton
        title="Save"
        handlePress={handleSavePress}
        containerStyles="mx-5"
      />
    </SafeAreaView>
  );
};

export default Profile;
