const School = require("../models/schoolModel");
const asyncHandler = require("../middlewares/asyncHandler");

// @desc    Add a new school
// @route   POST /api/schools
// @access  Public
const addSchool = asyncHandler(async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Input validation
  if (!name || !address || !latitude || !longitude) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  // Create and save the school document
  const school = new School({ name, address, latitude, longitude });
  await school.save();

  res.status(201).json({ message: "School added successfully!", school });
});

// @desc    List schools sorted by proximity
// @route   GET /api/schools
// @access  Public
const listSchools = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;

  // Ensure latitude and longitude are provided in the query
  if (!latitude || !longitude) {
    res.status(400);
    throw new Error("Latitude and longitude are required.");
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  // Retrieve all schools from the database
  const schools = await School.find();

  // Calculate distance between the user's location and each school's location
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Sort schools by distance to the user's location
  const sortedSchools = schools
    .map((school) => ({
      ...school.toObject(),
      distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
    }))
    .sort((a, b) => a.distance - b.distance);

  // Return the sorted list of schools
  res.status(200).json(sortedSchools);
});

module.exports = { addSchool, listSchools };
