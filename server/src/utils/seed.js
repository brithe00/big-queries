import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seed() {
  const numberOfProducts = 1000;

  for (let i = 0; i < numberOfProducts; i++) {
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: parseFloat(faker.commerce.price()),
        brand: faker.company.name(),
        color: faker.color.human(), // Corrected color generation
        size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
        weight: parseFloat((Math.random() * 3 + 1).toFixed(2)), // Weight between 1.00 and 3.99 kg
        description: faker.commerce.productDescription(),
        inStock: faker.datatype.boolean(),
        rating: parseFloat((Math.random() * 5).toFixed(1)), // Rating between 0.0 and 5.0
        reviewsCount: faker.number.int({ min: 0, max: 500 }),
        sku: faker.string.alphanumeric(8).toUpperCase(), // SKU like '1A2B3C4D'
        discountPercent: faker.number.int({ min: 0, max: 50 }), // Discount between 0% and 50%
        isFeatured: faker.datatype.boolean(),
        tags: faker.helpers.arrayElements(
          ["electronics", "fashion", "smartphone", "laptop", "home"],
          2
        ), // Random 2 tags
      },
    });
  }

  console.log(`${numberOfProducts} products created!`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
