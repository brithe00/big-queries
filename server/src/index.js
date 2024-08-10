import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("big queries - v0");
});

const buildWhereClause = (query) => {
  let where = {};

  if (query.name) where.name = { contains: query.name };
  if (query.category) where.category = { equals: query.category };
  if (query.minPrice) where.price = { gte: parseFloat(query.minPrice) };
  if (query.maxPrice) where.price = { lte: parseFloat(query.maxPrice) };
  if (query.brand) where.brand = { equals: query.brand };
  if (query.color) where.color = { equals: query.color };
  if (query.size) where.size = { equals: query.size };
  if (query.minWeight) where.weight = { gte: parseFloat(query.minWeight) };
  if (query.maxWeight) where.weight = { lte: parseFloat(query.maxWeight) };
  if (query.minRating) where.rating = { gte: parseFloat(query.minRating) };
  if (query.minReviewsCount)
    where.reviewsCount = { gte: parseInt(query.minReviewsCount) };
  if (query.sku) where.sku = { equals: query.sku };
  if (query.minDiscountPercent)
    where.discountPercent = { gte: parseInt(query.minDiscountPercent) };
  if (query.isFeatured)
    where.isFeatured = { equals: query.isFeatured === "true" };
  if (query.tags) where.tags = { hasSome: query.tags.split(",") }; // Expects a comma-separated string of tags
  if (query.inStock) where.inStock = { equals: query.inStock === "true" };

  return where;
};

app.get("/products", async (req, res) => {
  try {
    const where = buildWhereClause(req.query);

    console.log(where);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const products = await prisma.product.findMany({
      where: where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        //brand: true,
        //color: true,
        //size: true,
        //weight: true,
        //rating: true,
        //reviewsCount: true,
        //sku: true,
        //discountPercent: true,
        //isFeatured: true,
        //tags: true,
        //inStock: true,
      },
    });

    const totalCount = await prisma.product.count({
      where: where,
    });

    res.json({
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      pageSize: pageSize,
      totalCount: totalCount,
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
