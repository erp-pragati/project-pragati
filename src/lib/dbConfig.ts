import mongoose from "mongoose";

export async function dbConnect() {
  // If the connection is already established, log a message and return
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB Already Connected");
    return;
  }

  try {
    // Attempt to connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI!);

    // Log a success message if the connection is successful
    console.log("MongoDB connected successfully");

    // Set up an event listener for connection errors
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  } catch (error) {
    // Log the error message if the connection attempt fails
    console.error("Failed to connect to MongoDB:", error);

    // Exit the process with a failure code
    process.exit(1);
  }
}
