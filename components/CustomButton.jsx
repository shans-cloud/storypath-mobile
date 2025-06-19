import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

/**
 * CustomButton Component
 *
 * A customizable button component for React Native that supports loading state and custom styles.
 * It uses a `TouchableOpacity` to handle button presses and displays an `ActivityIndicator` when
 * in a loading state.
 *
 * @component
 *
 * @param {string} title - The text displayed on the button.
 * @param {function} handlePress - The function to be called when the button is pressed.
 * @param {string} containerStyles - Additional TailwindCSS classes for styling the button container.
 * @param {string} textStyles - Additional TailwindCSS classes for styling the button text.
 * @param {boolean} isLoading - A boolean to determine if the button is in a loading state. Defaults to `false`.
 *
 * - The button is disabled when `isLoading` is `true` to prevent multiple presses.
 * - Displays a loading spinner (`ActivityIndicator`) when `isLoading` is `true`.
 *
 * @returns {JSX.Element} The custom button component with text or a loading spinner.
 */
const CustomButton = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isLoading}
      className={`bg-accent rounded-full py-3 px-3 ${containerStyles}`}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          className={`font-pbold text-white text-center text-lg ${textStyles}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
