import mongoose from "mongoose";
import dns from "dns";

// On non-production environments (Windows dev), Atlas SRV lookups can fail
// with ECONNREFUSED. Forcing IPv4 DNS order fixes it locally without
// affecting Render's Linux resolver.
if (process.env.NODE_ENV !== "production") {
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
