import { Prisma, Category, Meal } from "../../../generated/prisma/client";
import AppError from "../../errors/appError";
import { prisma } from "../../lib/prisma";
import { generateSlug } from "../../utils/generateSlug";
import { StatusCodes } from "http-status-codes";

/**
 * Types for category operations
 */
export type TCategoryFilters = {
  searchTerm?: string;
};

export type TCategoryWithCount = Category & {
  _count: {
    meals: number;
  };
};

export type TCategoryWithMeals = Category & {
  meals: Pick<Meal, 'id' | 'name' | 'price' | 'description' | 'imageUrl'>[];
};

/**
 * Create a new category
 */
const createCategory = async (payload: Prisma.CategoryCreateInput): Promise<TCategoryWithCount> => {
  const slug = generateSlug(payload.name);

  // Check if category with same slug already exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug }
  });

  if (existingCategory) {
    throw new AppError(StatusCodes.CONFLICT, "Category already exists", "name");
  }

  const result = await prisma.category.create({
    data: {
      name: payload.name,
      slug,
      imageUrl: payload.imageUrl ?? null,
    },
    include: {
      _count: {
        select: { meals: true },
      },
    },
  });

  return result;
};

/**
 * Get all categories with optional filters
 */
const getAllCategories = async (
  filters: TCategoryFilters,
): Promise<{
  data: TCategoryWithCount[];
  meta: { total: number };
}> => {
  const { searchTerm } = filters;

  // Build where condition based on filters
  const whereCondition: Prisma.CategoryWhereInput = {};

  if (searchTerm) {
    whereCondition.name = {
      contains: searchTerm,
      mode: "insensitive",
    };
  }

  // Use transaction for consistent data
  const [categories, total] = await prisma.$transaction([
    prisma.category.findMany({
      where: whereCondition,
      include: {
        _count: {
          select: { meals: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.category.count({
      where: whereCondition,
    })
  ]);

  return {
    data: categories,
    meta: { total },
  };
};

/**
 * Get single category by ID with its meals
 */
const getCategoryById = async (id: string): Promise<TCategoryWithMeals> => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      meals: {
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found", "id");
  }

  return category;
};

/**
 * Get single category by slug with its meals
 */
const getCategoryBySlug = async (slug: string): Promise<TCategoryWithMeals> => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      meals: {
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found", "slug");
  }

  return category;
};

/**
 * Update category by ID
 */
const updateCategory = async (id: string, payload: Prisma.CategoryUpdateInput): Promise<TCategoryWithCount> => {
  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found", "id");
  }

  const updateData: Prisma.CategoryUpdateInput = { ...payload };

  // If name is being updated, check for duplicate and update slug
  if (payload.name && typeof payload.name === "string" && payload.name !== existingCategory.name) {
    const slug = generateSlug(payload.name);
    
    const duplicateCategory = await prisma.category.findUnique({
      where: { slug }
    });

    // Check if duplicate exists AND it's not the same category being updated
    if (duplicateCategory && duplicateCategory.id !== id) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "Category name already exists",
        "name"
      );
    }

    updateData.slug = slug;
  }

  const result = await prisma.category.update({
    where: { id },
    data: updateData,
    include: {
      _count: {
        select: { meals: true },
      },
    },
  });

  return result;
};

/**
 * Delete category by ID
 */
const deleteCategory = async (id: string): Promise<Category> => {
  // Check if category exists and has meals
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { meals: true },
      },
    },
  });

  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found", "id");
  }

  // Prevent deletion if category has meals
  if (category._count.meals > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Cannot delete category with meals", "id");
  }

  const result = await prisma.category.delete({
    where: { id },
  });

  return result;
};

/**
 * Delete multiple categories at once
 */
const bulkDeleteCategories = async (ids: string[]): Promise<{ count: number }> => {
  // Check if any category has meals
  const categoriesWithMeals = await prisma.category.findMany({
    where: {
      id: { in: ids },
      meals: { some: {} }
    }
  });

  if (categoriesWithMeals.length > 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST, 
      "Cannot delete categories with meals", 
      "ids"
    );
  }

  // Delete all valid categories
  const result = await prisma.category.deleteMany({
    where: {
      id: { in: ids }
    }
  });

  return { count: result.count };
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
};