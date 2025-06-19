import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

/**
 * InfoBox Component
 *
 * A versatile component that displays a box containing a title and a value. It can be used
 * as a static information display or a clickable button depending on whether an `onPress`
 * function is provided.
 *
 * @component
 *
 * @param {string} title - The title text displayed at the top of the InfoBox.
 * @param {string|number} value - The value text displayed below the title.
 * @param {string} style - Additional TailwindCSS classes for styling the container.
 * @param {function} [onPress] - Optional. The function to be called when the InfoBox is pressed.
 *
 * - Uses `TouchableOpacity` when `onPress` is provided, allowing the box to be clickable.
 * - Falls back to using a `View` when `onPress` is not provided, making it a static display.
 *
 * @returns {JSX.Element} The styled InfoBox component with a title and value, optionally clickable.
 */
const InfoBox = ({ title, value, style, onPress }) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      className={`flex-1 rounded-lg p-4 items-center m-2 ${style}`}
      onPress={onPress}
    >
      <Text className="text-white font-pbold text-md">{title}</Text>
      <Text className="text-white font-psemibold mt-1 text-2xl">{value}</Text>
    </Container>
  );
};

export default InfoBox;
