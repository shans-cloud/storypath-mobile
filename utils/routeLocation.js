import { Alert } from "react-native";

/**
 * handleLocationProximity Function
 *
 * This function triggers an alert when the user is within proximity of a specified location.
 * The alert provides options to either dismiss the notification or navigate to the detailed
 * information page of the location.
 *
 * @function
 *
 * @param {object} location - The location object containing details like the location name.
 * @param {function} navigate - The navigation function used to navigate to the "Location Detail" screen.
 *
 * - Displays an alert with the message that the user is within 50 meters of the location.
 * - Provides two options in the alert: "Dismiss" to close the alert, and "Learn More" to navigate to the location details.
 */
export const handleLocationProximity = (location, navigate) => {
  Alert.alert(
    "Location Nearby!",
    `You are within 50 meters of ${location.location_name}.`,
    [
      {
        text: "Dismiss", // Option to do nothing and close the alert
        style: "cancel",
      },
      {
        text: "Learn More",
        onPress: () => navigate("Location Detail", { location }),
      },
    ]
  );
};
