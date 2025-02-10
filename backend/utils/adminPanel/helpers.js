import { REGISTERD_MODELS } from "../../Configurations/adminConfig.js";
import { exec } from "child_process";

export const getRegisterdModels = () => {
  return [...new Set(REGISTERD_MODELS.map((model) => model.toLowerCase()))]
    .filter((model) => model !== "model" || model !== "modelField")
    .map((model) => model.charAt(0).toUpperCase() + model.slice(1));
};

export const runPrismaMigration = async () => {
  // ✅ Generate a timestamp-based migration name (YYYYMMDD_HHMMSS)
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14); // Keep only YYYYMMDDHHMMSS

  const migrationName = `migration_${timestamp}`;

  return new Promise((resolve, reject) => {
    console.log(`🚀 Running Prisma migration: ${migrationName}...`);

    exec(
      `npx prisma migrate dev --name ${migrationName}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Migration failed:", error);
          reject(error);
        } else {
          console.log("✅ Migration successful:", stdout);
          resolve(stdout);
        }
      }
    );
  });
};
