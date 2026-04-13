// backend/src/app.vercel.js
// Vercel serverless entry point - no listen(), just export the app

import "dotenv/config";
import { app } from "./app.js"; // your existing express app
import { connectDB } from "./db/index.js";

// Connect DB once (Vercel reuses function instances)
await connectDB();

export default app; // ✅ Vercel needs this exact export
