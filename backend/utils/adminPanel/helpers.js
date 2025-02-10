import { REGISTERD_MODELS } from "../../Configurations/adminConfig.js";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const getRegisterdModels = () => {
  return [...new Set(REGISTERD_MODELS.map((model) => model.toLowerCase()))]
    .filter((model) => model !== "model" && model !== "modelField")
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

export const removeModelFromPrismaSchema = async (prismaName) => {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");

  try {
    // ✅ Read schema.prisma
    let schemaContent = fs.readFileSync(schemaPath, "utf8");

    // ✅ Regex to find the model block
    const modelRegex = new RegExp(
      `model\\s+${prismaName}\\s+\\{[\\s\\S]*?\\}\n*`,
      "g"
    );

    if (!schemaContent.match(modelRegex)) {
      console.log(
        `⚠️ Model ${prismaName} does not exist in schema.prisma. Skipping removal.`
      );
      return;
    }

    // ✅ Remove the model from schema.prisma
    schemaContent = schemaContent.replace(modelRegex, "");

    // ✅ Write the updated schema
    fs.writeFileSync(schemaPath, schemaContent, "utf8");
    console.log(`✅ Model ${prismaName} has been removed from schema.prisma.`);

    // ✅ Run Prisma migration to apply changes
    await runPrismaMigration();
    return true;
  } catch (error) {
    console.error("❌ Error updating schema.prisma:", error);
  }
};
