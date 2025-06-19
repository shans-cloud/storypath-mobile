import React from "react";
import { Text } from "react-native";

/**
 * CustomHeaderTitle Component
 *
 * A simple component that renders a custom header title using styled text.
 *
 * @component
 *
 * @param {string} title - The text to display as the header title.
 *
 * @returns {JSX.Element} The header title styled with custom font and color.
 */
const CustomHeaderTitle = ({ title }) => {
  return (
    <Text className="text-2xl font-psemibold text-primary-dark">{title}</Text>
  );
};

export default CustomHeaderTitle;
