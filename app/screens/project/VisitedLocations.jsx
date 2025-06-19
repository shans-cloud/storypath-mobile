import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

/**
 * VisitedLocations Component
 *
 * This component displays a list of locations that have been visited by the user. Each location
 * can be pressed to navigate to the Location Detail screen for more information. The component
 * is populated with location data passed through the route parameters.
 *
 * @component
 *
 * @param {object} route - The route object containing parameters, such as the list of visited locations.
 * @param {Array} route.params.locations - The array of visited locations to display.
 *
 * - Uses `FlatList` to efficiently render a list of locations with a scrollable view.
 * - Handles navigation to the Location Detail screen when a location item is pressed.
 *
 * @returns {JSX.Element} The visited locations screen displaying a list of locations or a message if no locations have been visited.
 */
const VisitedLocations = ({ route }) => {
  const { locations } = route.params;
  const navigation = useNavigation();

  // Handle navigation to location detail
  const handleLocationPress = (location) => {
    navigation.navigate("Location Detail", { location });
  };

  return (
    <View className="bg-white flex-1 p-5">
      {locations.length > 0 ? (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 my-1 border border-accent rounded-md bg-accent/20"
              onPress={() => handleLocationPress(item)}
            >
              <Text className="text-lg font-pbold text-primary-dark">
                {item.location_name}
              </Text>
              <Text className="text-base font-pregular text-gray">
                Points: {item.score_points}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No locations visited yet.</Text>
      )}
    </View>
  );
};

export default VisitedLocations;
