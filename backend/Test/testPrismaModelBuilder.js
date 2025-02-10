import PrismaModelBuilder from "../utils/adminPanel/prismaModelBuilder.js";

export async function testGetModelFromPrismaSchema() {
  // ✅ Create a test model object with prismaName = "Product"
  const testModel = { prismaName: "Product" };

  // ✅ Initialize PrismaModelBuilder with the test model
  const modelBuilder = new PrismaModelBuilder(testModel);

  // ✅ Call getModelFromPrismaSchema() to fetch the model from schema.prisma
  const result = await modelBuilder.getModelFromPrismaSchema();
  const fields = await modelBuilder.getModelFields(result.modelDefinition);
  // ✅ Print the output
  console.log("Test Result:", result);
}
