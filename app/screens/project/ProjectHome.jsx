import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "@/components/context/UserContext";
import { getDistance } from "geolib";
import LocationCard from "@/components/LocationCard";
import { parseLocationPosition } from "@/utils/parseLocation";
import { handleLocationProximity } from "@/utils/routeLocation";
import InfoBox from "@/components/CustomInfoBox";

/**
 * ProjectHome Component
 *
 * This component displays the home screen for a specific project, providing information such as the project's
 * title, scoring method, instructions, and locations. It also checks the user's proximity to project locations
 * and tracks visited locations, updating the user's score when they are within range.
 *
 * @component
 *
 * @param {object} navigation - The navigation object used for navigating between screens.
 * @param {object} route - The route object containing parameters, such as the project details and locations.
 * @param {object} route.params.project - The project details, including title, scoring, and instructions.
 * @param {Array} route.params.locations - The list of locations associated with the project.
 *
 * - Uses `UserContext` to access user data, current location, and functions to track visits and manage scores.
 * - Checks if the user is within 50 meters of any project location and updates tracking data accordingly.
 * - Displays the project's instructions or initial clue, and lists the locations if available.
 * - Provides navigation to the Visited Locations screen, passing only locations visited for the current project.
 *
 * @returns {JSX.Element} The project home screen with project information, location proximity tracking, and navigation options.
 */
const ProjectHome = ({ navigation, route }) => {
  const { project, locations } = route.params;
  const { user, userLocation, addTracking, trackings, projectScores } =
    useContext(UserContext);

  const maxScore = locations.reduce((acc, loc) => acc + loc.score_points, 0);
  const visitedLocations = locations.filter((location) =>
    trackings.some(
      (tracking) =>
        tracking.participant_username === user &&
        tracking.project_id === project.id &&
        tracking.location_id === location.id
    )
  );

  // Check if the user is within 50 meters of any location
  const checkProximityToLocations = async () => {
    try {
      await Promise.all(
        locations.map(async (location) => {
          const locationCoordinates = parseLocationPosition(
            location.location_position
          );
          const distance = getDistance(userLocation, locationCoordinates);
          if (
            user &&
            distance <= 50 &&
            project.participant_scoring === "Number of Locations Entered"
          ) {
            // Only track and navigate when they are a user
            await addTracking(project.id, location.id, location.score_points);
            handleLocationProximity(location, navigation.navigate);
          }
        })
      );
    } catch (error) {
      console.error("Error in processing locations:", error);
    }
  };

  // Navigate to visited locations and pass only that for this project
  const handleVisitedLocationsPress = () => {
    navigation.navigate("Visited Locations", { locations: visitedLocations });
  };

  // Effect to check proximity when user location or project locations change
  useEffect(() => {
    if (userLocation && locations.length > 0) {
      checkProximityToLocations();
    }
  }, [userLocation, locations]);

  return (
    <ScrollView className="bg-white w-full h-full pt-2 px-2">
      <View className="pl-2 pr-2">
        <Text className="text-center mb-2 text-3xl text-accent-dark font-pbold">
          {project.title}
        </Text>

        <Text className="font-pregular text-lg mb-3">
          Score by:{"\n"}
          {project.participant_scoring}
        </Text>
        <Text className="font-pregular text-lg mb-3">
          Instructions:{"\n"}
          {project.instructions}
        </Text>

        {project.homescreen_display === "Display initial clue" ? (
          <View>
            <Text className="font-pregular text-lg mb-3">
              Initial clue:{"\n"}
              {project.initial_clue}
            </Text>
          </View>
        ) : (
          <View>
            <Text className="font-psemibold text-xl mt-1">
              Project Locations:
            </Text>
            {locations.length > 0 ? (
              locations.map((location) => (
                <View key={location.id}>
                  <LocationCard location={location} />
                </View>
              ))
            ) : (
              <Text className="font-pregular text-lg">
                No locations found for this project.
              </Text>
            )}
          </View>
        )}
      </View>

      <View className="flex-row justify-between mt-2">
        <InfoBox
          title="Your Score"
          value={`${projectScores[project.id] || 0}/${maxScore}`}
          style="border border-accent-dark bg-accent/80"
        />
        {/* Route to visited locations when this is pressed */}
        <InfoBox
          title="Visited Locations"
          value={`${visitedLocations.length}/${locations.length}`}
          style="border border-accent-dark bg-accent/80"
          onPress={handleVisitedLocationsPress}
        />
      </View>
    </ScrollView>
  );
};

export default ProjectHome;
