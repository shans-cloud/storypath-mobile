import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPublishedProjects } from "@/services/api";

/**
 * ProjectList Component
 *
 * This component displays a list of published projects fetched from the API. Users can tap on a project to
 * navigate to the Project Details screen.
 *
 * @component
 *
 * - Fetches published projects from the API using the `getPublishedProjects` service function.
 * - Uses `useNavigation` from `@react-navigation/native` to handle navigation to the Project Details screen.
 *
 * @returns {JSX.Element} The project list screen with a list of projects and navigation functionality.
 */

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Function to fetch projects from the API
  const fetchProjects = useCallback(async () => {
    try {
      const projectData = await getPublishedProjects();
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Effect to fetch projects when the component mounts
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Function to handle the event when a project is pressed
  const handleProjectPress = (project) => {
    navigation.navigate("Project Details", { project });
  };

  // Function to handle pull-to-refresh actions
  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-lg">Loading projects...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-4xl font-pbold mt-3 mb-4 text-accent-dark">
        Projects List
      </Text>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-5 mb-3 bg-accent/80 rounded-xl flex-row justify-between items-center border border-accent-dark/75"
            onPress={() => handleProjectPress(item)}
          >
            <Text className="text-xl font-pbold text-white flex-1">
              {item.title}
            </Text>
            <Text className="text-white font-plight">
              Participants: {item.participantCount}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default ProjectList;
