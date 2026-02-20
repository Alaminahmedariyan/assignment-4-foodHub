import { z } from "zod";

/**
 * Create Category Validation Schema
 * Slug is NOT required because it is generated in backend
 */
export const createCategoryZodSchema = z.object({
  name: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.received === "undefined") {
          return "Category name is required";
        }
        return "Category name must be a string";
      },
    })
    .trim()
    .min(2, { error: () => "Category name must be at least 2 characters" })
    .max(50, { error: () => "Category name cannot exceed 50 characters" }),

  imageUrl: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.received === "undefined") {
          return undefined; // Let next error map handle it
        }
        return "Image URL must be a string";
      },
    })
    .url({ error: () => "Invalid image URL format" })
    .optional()
    .nullable(),
});

/**
 * Update Category Validation Schema
 */
export const updateCategoryZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: () => "Category name must be at least 2 characters" })
    .max(50, { error: () => "Category name cannot exceed 50 characters" })
    .optional(),

  imageUrl: z
    .string()
    .trim()
    .url({ error: () => "Invalid image URL format" })
    .optional()
    .nullable(),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};