import prisma from "../../prisma/prismaClient.js";
import { getRegisterdModels } from "../../utils/adminPanel/helpers.js";

export const getAllModelsService = async ({
  fields = [],
  onlyRegisteredModels = false,
}) => {
  try {
    const registeredModels = getRegisterdModels();

    const whereClause = onlyRegisteredModels
      ? { prismaName: { in: registeredModels } }
      : {};

    const selectClause =
      fields.length > 0
        ? fields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
        : undefined;

    return await prisma.model.findMany({
      where: whereClause,
      select: selectClause,
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    throw new Error("Failed to retrieve models");
  }
};

export const getModelByIdService = async (id) => {
  return await prisma.model.findUnique({ where: { id } });
};

export const getModelByPrismaName = async (prismaName) => {
  return await prisma.model.findUnique({ where: { prismaName } });
};

export const deleteModelService = async (prismaName) => {
  const model = await getModelByPrismaName(prismaName);
  if (!model) return false;

  await prisma.model.delete({ where: { prismaName } });
  return true;
};

export const createModelService = async (model) => {
  return await prisma.model.create({
    data: {
      displayName: model.charAt(0).toUpperCase() + model.slice(1),
      prismaName: model,
    },
  });
};

export const bulkCreateModelService = async (models) => {
  if (!Array.isArray(models)) {
    console.error("❌ Invalid input type: Expected an array");
    return { error: "Invalid input type" };
  }

  try {
    await prisma.model.createMany({
      data: models.map((name) => ({
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        prismaName: name,
      })),
      skipDuplicates: true, // Ensure no duplicates
    });

    console.log(`✅ Successfully inserted models: ${models.join(", ")}`);
  } catch (error) {
    console.error("❌ Error inserting models:", error);
  }
};
