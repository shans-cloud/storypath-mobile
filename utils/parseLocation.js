/**
 * parseLocationPosition Function
 *
 * A utility function that parses a location position string into an object containing
 * latitude and longitude as floating-point numbers. The input string is expected to be
 * in the format "(latitude,longitude)".
 *
 * @function
 *
 * @param {string} locationPosition - The string representing the location's coordinates, formatted as "(latitude,longitude)".
 *
 * @returns {object} An object with `latitude` and `longitude` properties as floating-point numbers.
 */
export const parseLocationPosition = (locationPosition) => {
  const [latitude, longitude] = locationPosition
    .replace(/[()]/g, "")
    .split(",")
    .map((coord) => parseFloat(coord));
  return { latitude, longitude };
};
