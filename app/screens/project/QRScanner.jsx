import { View, Text, StyleSheet, Button, Alert } from "react-native";
import React, { useState, useContext } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { UserContext } from "@/components/context/UserContext";
import { handleLocationProximity } from "@/utils/routeLocation";
import CustomButton from "@/components/CustomButton";

/**
 * QRScanner Component
 *
 * This component provides a QR code scanning interface using the `expo-camera` package. It handles scanning
 * QR codes and verifies if the scanned code matches the expected project and location data. It also handles
 * user permissions and navigation based on the scan results.
 *
 * @component
 *
 * @param {object} navigation - The navigation object used for navigating between screens.
 * @param {object} route - The route object containing parameters, such as the project and locations data.
 * @param {object} route.params.project - The project details passed through the route.
 * @param {Array} route.params.locations - The list of locations related to the project.
 *
 * - Uses `expo-camera` to request and manage camera permissions.
 * - Scans and processes QR codes, verifying the scanned data against the project and location parameters.
 * - Updates the user's tracking data using the `UserContext` if the scanned QR code is valid.
 * - Displays alerts for errors and feedback, and allows the user to rescan if needed.
 *
 * @returns {JSX.Element} The QR code scanning interface with camera view and options for rescanning.
 */
const QRScanner = ({ navigation, route }) => {
  const { project, locations } = route.params;
  const { user, loading, addTracking } = useContext(UserContext);

  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-center mb-2">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#000fff" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // Checking if it's a QR code
    if (type !== "org.iso.QRCode") {
      Alert.alert("Error", "Please scan a QR code!", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
      return;
    }

    // Data is stored as project_id, location_id i.e. 1,3 so we split the data
    const [scannedProjectId, scannedLocationId] = data.split(",");

    if (scannedProjectId === project.id) {
      Alert.alert("Error", "Scanned code does not match the current project!", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    }

    const scannedLocation = locations.find(
      (location) => location.id.toString() === scannedLocationId
    );

    if (!scannedLocation) {
      Alert.alert("Error", "Scanned location is not valid for this project!", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
      return;
    }

    if (user && project.participant_scoring === "Number of Scanned QR Codes") {
      await addTracking(
        project.id,
        scannedLocation.id,
        scannedLocation.score_points
      );
    }
    // Allow non-user's and non-scorer's to see location details
    handleLocationProximity(scannedLocation, navigation.navigate);
    setScannedData(data);
  };

  return (
    <View className="flex-1 bg-white">
      <Text className="text-center mb-2 text-2xl text-accent-dark font-psemibold">
        {project.title}
      </Text>
      <CameraView
        style={styles.camera}
        type="front"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      ></CameraView>
      {scanned && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-4">
          <CustomButton
            title="Tap to Scan Again"
            handlePress={() => setScanned(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});

export default QRScanner;
