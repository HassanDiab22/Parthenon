import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";
import adminRoutes from "./routes/adminPanel/adminRoutes.js";
import { testGetModelFromPrismaSchema } from "./Test/testPrismaModelBuilder.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(errorHandler);

app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🚀 Server is running!" });
});
// ✅ Run the test
testGetModelFromPrismaSchema();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
