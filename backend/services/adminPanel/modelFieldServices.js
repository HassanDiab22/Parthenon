import prisma from "../../prisma/prismaClient.js";
import { getAllModelsService } from "./modelServices.js";

export const createModelFieldsService = async ({ fields }) => {
  try {
    const models = await getAllModelsService({ fields: ["id"] });
    const modelIds = models.map((item) => item.id);

    const filteredFields =
      fields?.filter((field) => modelIds.includes(field.modelId)) || [];

    if (filteredFields.length === 0) {
      return { success: false, error: "No valid fields to insert." };
    }

    const createdFields = await prisma.modelField.createMany({
      data: filteredFields,
    });

    return { success: true, count: createdFields.count };
  } catch (error) {
    console.error("Error creating model fields:", error);
    return { success: false, error: error.message };
  }
};
