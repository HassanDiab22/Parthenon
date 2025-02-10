import fs from "fs";
import path from "path";

class PrismaModelBuilder {
  constructor(model) {
    this.model = model;
  }

  async getModelFromPrismaSchema() {
    const modelName = this.model.prismaName;
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");

    try {
      // Read schema.prisma file
      const schemaContent = fs.readFileSync(schemaPath, "utf8");

      // Regex to extract the model definition
      const modelRegex = new RegExp(
        `model\\s+${modelName}\\s+\\{[\\s\\S]*?\\}`,
        "g"
      );

      // Find model in schema
      const match = schemaContent.match(modelRegex);

      if (match && match.length > 0) {
        return { success: true, modelDefinition: match[0] };
      } else {
        return {
          success: false,
          message: `Model ${modelName} not found in schema.prisma`,
        };
      }
    } catch (error) {
      console.error("Error reading schema.prisma:", error);
      return { success: false, error: error.message };
    }
  }

  async getModelFields(modelDefinition) {
    const fields = [];

    const lines = modelDefinition.split("\n").slice(1, -1);

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);

      if (parts.length < 2) continue;

      const fieldStructure = {
        name: parts[0],
        type: parts[1].toUpperCase(),
      };

      fields.push(fieldStructure);
    }

    return fields;
  }
}

export default PrismaModelBuilder;
