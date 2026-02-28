import mongoose from "mongoose";
import dns from "dns";

// On Windows dev, the system DNS blocks SRV queries used by Atlas +srv URIs.
// Overriding to Google/Cloudflare DNS + ipv4first fixes it locally.
// Skipped on Render (production) where the native resolver works correctly.
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  dns.setDefaultResultOrder("ipv4first");
}

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
