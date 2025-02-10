import fs from "fs";
import path from "path";
import prisma from "./prismaClient.js";

const schemaPath = path.resolve("prisma/schema.prisma");

async function detectAndInsertModels() {
  try {
    // Read the Prisma schema file
    const schemaContent = fs.readFileSync(schemaPath, "utf8");

    // Extract model names from the schema file
    const modelNames = [...schemaContent.matchAll(/model (\w+) {/g)].map(
      (match) => match[1]
    );

    // Get existing models in the database
    const existingModels = await prisma.model.findMany();
    const existingModelNames = existingModels.map((m) => m.prismaName);

    // Find new models that are not in the database
    const newModels = modelNames.filter(
      (name) => !existingModelNames.includes(name)
    );

    if (newModels.length > 0) {
      // Insert new models into the Model table
      await prisma.model.createMany({
        data: newModels.map((name) => ({
          displayName: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
          prismaName: name,
        })),
      });

      console.log(
        `✅ Added new models to the Model table: ${newModels.join(", ")}`
      );
    } else {
      console.log("⚡ No new models detected.");
    }
  } catch (error) {
    console.error("❌ Error in migration hook:", error);
  } finally {
    await prisma.$disconnect();
  }
}

detectAndInsertModels();
