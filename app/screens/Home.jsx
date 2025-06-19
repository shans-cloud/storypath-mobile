import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import CustomButton from "@/components/CustomButton";
import { useNavigation } from "@react-navigation/native";

/**
 * Home Component
 *
 * The Home component serves as the landing screen for the StoryPath app, featuring a welcoming
 * message and a call to action. Users are introduced to the app's purpose and can navigate to
 * the Project List screen to start exploring.
 *
 * @component
 *
 * - Displays a background image that covers the entire screen using `ImageBackground`.
 * - Includes a logo image, a welcome message, and a brief description of the app's functionality.
 * - Uses a `CustomButton` component to allow users to navigate to the Project List screen.
 *
 * @returns {JSX.Element} The Home screen with a background image, logo, welcome text, description, and a button.
 */
const Home = ({}) => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../assets/images/hero.jpg")}
      className="flex w-full h-full"
    >
      <View className="flex">
        <View className="justify-center items-center">
          <Image
            source={require("@/assets/images/storypath.png")}
            className="w-[80%]"
            resizeMode="contain"
          />
        </View>

        {/* Welcome Message */}
        <Text className="text-3xl text-accent-dark font-pbold text-center mb-2">
          Welcome to StoryPath
        </Text>

        <Text className="font-pregular text-lg text-gray text-center mb-8 px-4">
          Embark on a journey of discovery. Scan QR codes to unlock locations,
          uncover clues, and explore hidden stories.
        </Text>

        <View className="items-center mt-10">
          <CustomButton
            title="Explore"
            handlePress={() => {
              navigation.navigate("screens/ProjectList");
            }}
            isLoading={false}
            containerStyles="w-[50%]"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Home;
