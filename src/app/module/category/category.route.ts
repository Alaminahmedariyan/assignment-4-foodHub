import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "./category.validation";

const router = Router();

/**
 * Order matters!
 * Specific routes first
 */

// Get by slug FIRST
router.get("/slug/:slug", CategoryController.getCategoryBySlug);

// Get by ID
router.get("/:id", CategoryController.getCategoryById);

// Get all
router.get("/", CategoryController.getAllCategories);

// Create
router.post(
  "/create-category",
  validateRequest(createCategoryZodSchema),
  CategoryController.createCategory
);

// Update
router.patch(
  "/:id",
  validateRequest(updateCategoryZodSchema),
  CategoryController.updateCategory
);

// Delete
router.delete("/:id", CategoryController.deleteCategory);

// Bulk delete
router.post("/bulk-delete", CategoryController.bulkDeleteCategories);

export const CategoryRoute = router;