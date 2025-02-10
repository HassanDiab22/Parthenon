import fs from "fs";
import path from "path";

class PrismaModelBuilder {
  constructor(model) {
    this.model = model;
  }

  async syncPrismaModel(fields) {
    const modelDefinitionResult = await this.getModelFromPrismaSchema();

    const modelFields = await this.getModelFields(
      modelDefinitionResult.modelDefinition
    );

    const fieldsDefinition = [];

    for (const field of fields) {
      const fieldDefinition = await this.fieldBuilder(field);
      fieldsDefinition.push(fieldDefinition);
    }
    const modelConfig = await this.generateNewModelConfig(fieldsDefinition);
    await this.writeNewModelConfig(modelConfig, this.model.prismaName);
  }

  async writeNewModelConfig(modelConfig, modelName) {
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");

    try {
      // ✅ Read schema.prisma
      let schemaContent = fs.readFileSync(schemaPath, "utf8");

      // ✅ Regex to find the existing model block
      const modelRegex = new RegExp(
        `model\\s+${modelName}\\s+\\{[\\s\\S]*?\\}`,
        "g"
      );

      if (schemaContent.match(modelRegex)) {
        // ✅ If model exists, replace it
        schemaContent = schemaContent.replace(modelRegex, modelConfig);
      } else {
        // ✅ If model does not exist, append it at the end
        schemaContent += `\n\n${modelConfig}`;
      }

      // ✅ Write the updated schema back to schema.prisma
      fs.writeFileSync(schemaPath, schemaContent, "utf8");

      console.log(`✅ Model ${modelName} has been updated successfully.`);
    } catch (error) {
      console.error("❌ Error updating schema.prisma:", error);
    }
  }

  async generateNewModelConfig(fieldsDefinition) {
    if (!Array.isArray(fieldsDefinition) || fieldsDefinition.length === 0) {
      throw new Error("fieldsDefinition must be a non-empty array of strings.");
    }

    // ✅ Default fields (Always included)
    const defaultFields = [
      "id String @id @default(uuid())",
      "createdAt DateTime @default(now())",
    ];

    const allFields = [...defaultFields, ...fieldsDefinition];
    const uniqueFields = [...new Set(allFields)];

    const formattedFields = uniqueFields
      .map((field) => `  ${field}`)
      .join("\n");

    const config = `model ${this.model.prismaName} {
  ${formattedFields}
  }`;

    return config;
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
        type: parts[1],
      };

      fields.push(fieldStructure);
    }

    return fields.filter(
      (field) => field.name !== "id" && field.name !== "createdAt"
    );
  }

  async defaultValueBuilder(field) {
    if (!field.defaultValue) return "";

    let defaultString = " @default(";

    switch (field.type.toLowerCase()) {
      case "string":
        defaultString += `"${field.defaultValue}"`;
        break;
      case "boolean":
        defaultString += field.defaultValue ? "true" : "false";
        break;
      case "int":
      case "float":
      case "decimal":
        defaultString += field.defaultValue;
        break;
      case "datetime":
        defaultString += "now()";
        break;
      default:
        return "";
    }

    defaultString += ")";
    return defaultString;
  }

  async fieldBuilder(field) {
    if (!field || !field.name || !field.type) {
      throw new Error("Field must have a name and type.");
    }

    let fieldString = `${field.name} ${field.type}`;
    const defaultValue = await this.defaultValueBuilder(field);

    return fieldString + defaultValue;
  }

  async initFieldInPrismaSchema(model) {
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");

    try {
      // ✅ Read schema.prisma
      let schemaContent = fs.readFileSync(schemaPath, "utf8");

      // ✅ Check if model already exists
      const modelRegex = new RegExp(
        `model\\s+${model.prismaName}\\s+\\{[\\s\\S]*?\\}`,
        "g"
      );

      if (schemaContent.match(modelRegex)) {
        console.log(
          `✅ Model ${model.prismaName} already exists in schema.prisma. No changes made.`
        );
        return;
      }

      // ✅ Default fields (Always included)
      const defaultFields = [
        "id String @id @default(uuid())",
        "createdAt DateTime @default(now())",
      ];

      // ✅ Format model definition
      const modelDefinition = `\n\nmodel ${
        model.prismaName
      } {\n  ${defaultFields.join("\n  ")}\n}`;

      // ✅ Append new model to schema.prisma
      schemaContent += modelDefinition;
      fs.writeFileSync(schemaPath, schemaContent, "utf8");

      console.log(
        `✅ Model ${model.prismaName} has been added to schema.prisma.`
      );
    } catch (error) {
      console.error("❌ Error updating schema.prisma:", error);
    }
  }
}

export default PrismaModelBuilder;
