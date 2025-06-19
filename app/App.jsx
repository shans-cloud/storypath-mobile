import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppLayout from "./_layout";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

/**
 * App
 *
 * This component serves as the root of the application, wrapping all navigation and layout components.
 * It provides a safe area context and handles navigation setup using `react-native-safe-area-context`
 * and `@react-navigation/native`.
 */
const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer fallback={<Text>Loading...</Text>}>
        <AppLayout />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
