import { View, StyleSheet } from "react-native";
import React, { useContext } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { parseLocationPosition } from "@/utils/parseLocation";
import { UserContext } from "@/components/context/UserContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

/**
 * Map Component
 *
 * This component renders a map using `react-native-maps` to display the user's location and project-related
 * locations. It shows visited and unvisited locations as markers, with visual distinctions, and highlights
 * areas with circles to indicate proximity. The initial map region centers on the user's location, with
 * a default fallback to UQ St Lucia coordinates.
 *
 * @component
 *
 * @param {object} route - The route object containing parameters, such as the project and locations data.
 * @param {object} route.params.project - The project details, including the homescreen display setting.
 * @param {Array} route.params.locations - The list of locations related to the project.
 *
 * - Uses `UserContext` to access user data, the current user location, and tracking information.
 * - Filters locations based on whether all locations or only visited ones should be displayed, as determined
 *   by the project's `homescreen_display` setting.
 * - Displays circles around each location marker to indicate proximity and provides visual feedback based on
 *   whether a location has been visited.
 *
 * @returns {JSX.Element} The map screen with markers for project locations and the user's location.
 */
const Map = ({ route }) => {
  const { user, userLocation, trackings } = useContext(UserContext);
  const { project, locations } = route.params;

  // Determine locations to display based on homescreen_display setting
  const displayLocationsList =
    project.homescreen_display === "Display all locations"
      ? locations
      : locations.filter((location) =>
          trackings.some(
            (tracking) =>
              tracking.project_id === project.id &&
              tracking.location_id === location.id
          )
        );

  // Set the initial region to the user's location otherwise display UQ St Lucia
  const initialRegion = {
    latitude: userLocation ? userLocation.latitude : -27.4975,
    longitude: userLocation ? userLocation.longitude : 153.0137,
    latitudeDelta: 0.05, // Wider view
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {displayLocationsList.map((location) => {
          const coordinates = parseLocationPosition(location.location_position);
          // Check if the location is visited
          const isVisited = trackings.some(
            (tracking) =>
              tracking.user === user &&
              tracking.project_id === project.id &&
              tracking.location_id === location.id
          );

          return (
            <View key={location.id}>
              <Circle
                center={coordinates}
                radius={50}
                strokeWidth={2}
                strokeColor="orange"
                fillColor="rgba(251, 134, 0, 0.5)"
              />
              <Marker
                coordinate={coordinates}
                title={location.location_name}
                description={`${
                  isVisited ? "Visited" : "Not Visited"
                } - Points: ${location.score_points}`}
                pinColor="orange"
              />
            </View>
          );
        })}

        {/* Show only the user's location if no locations are displayed */}
        {displayLocationsList.length === 0 && userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="red"
          />
        )}
      </MapView>
    </View>
  );
};

export default Map;
