import React from "react";
import { Text, ScrollView } from "react-native";
import { WebView } from "react-native-webview";

/**
 * LocationDetail Component
 *
 * This component displays detailed information about a specific location, including its name, score points,
 * clue (if available), and content rendered in a `WebView`. The location details are passed as parameters
 * through the route object.
 *
 * @component
 *
 * @param {object} route - The route object containing parameters, such as the location data.
 * @param {object} route.params.location - The location details, including name, score points, clue, and content.
 *
 * - Displays the location's name, points, and clue, if present.
 * - Renders location-specific content using `react-native-webview` for displaying rich HTML content.
 *
 * @returns {JSX.Element} The location detail screen with location information and a web view for content.
 */
const LocationDetail = ({ route }) => {
  const { location } = route.params;

  return (
    <ScrollView className="flex-1 px-5 bg-white">
      <Text className="text-center py-2 text-3xl text-accent-dark font-pbold">
        {location.location_name}
      </Text>
      <Text className="font-pregular mb-3 text-primary-dark text-lg">
        Points: {location.score_points}
      </Text>
      {location.clue ? (
        <Text className="font-pregular mb-3 text-primary-dark text-lg">
          Clue: {location.clue}
        </Text>
      ) : null}
      <Text className="font-pregular mb-2 text-primary-dark text-lg">
        Location Information:
      </Text>
      {location.location_content ? (
        <WebView
          source={{ html: location.location_content }}
          style={{
            height: 400,
          }}
        />
      ) : null}
    </ScrollView>
  );
};

export default LocationDetail;
