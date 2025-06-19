import React from "react";
import { View, Text } from "react-native";
import { parseLocationPosition } from "@/utils/parseLocation";

/**
 * LocationCard Component
 *
 * A component that displays detailed information about a specific location, including its name,
 * trigger, coordinates, and an optional clue. The component uses parsed latitude and longitude
 * values to display location details in a formatted card style.
 *
 * @component
 *
 * @param {object} location - The location object containing details such as name, trigger, position, and clue.
 * @param {string} location.location_name - The name of the location.
 * @param {string} location.location_trigger - The trigger associated with the location.
 * @param {string} location.location_position - The string representing the location's coordinates.
 * @param {string} [location.clue] - An optional clue related to the location.
 *
 * - Parses the `location_position` to extract latitude and longitude using `parseLocationPosition`.
 * - Displays the location name, trigger, and coordinates in a card-like layout.
 * - Optionally displays a clue if it is provided in the location object.
 *
 * @returns {JSX.Element} The styled LocationCard component displaying location information.
 */
const LocationCard = ({ location }) => {
  const { latitude, longitude } = parseLocationPosition(
    location.location_position
  );
  return (
    <View
      key={location.id}
      className="mt-2 border border-gray-300 bg-white rounded-lg shadow p-4"
    >
      <Text className="text-lg font-pbold text-primary-dark">
        {location.location_name}
      </Text>
      <Text className="text-base font-pregular text-gray-700">
        Trigger: {location.location_trigger}
      </Text>
      <Text className="text-base font-pregular text-gray-700">
        Latitude: {latitude}
      </Text>
      <Text className="text-base font-pregular text-gray-700">
        Longitude: {longitude}
      </Text>
      {location.clue && (
        <Text className="text-base font-pregular text-accent">
          Clue: {location.clue}
        </Text>
      )}
    </View>
  );
};

export default LocationCard;
