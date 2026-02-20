import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CategoryService } from "./category.service";
import AppError from "../../errors/appError";

/**
 * Create a new category
 */
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Category created successfully",
    data: result
  });
});

/**
 * Get all categories with pagination and filters
 */
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories(req.query);

  // Prepare pagination metadata
  const meta = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    total: result.meta?.total || 0,
    totalPage: Math.ceil((result.meta?.total || 0) / (Number(req.query.limit) || 10))
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Categories fetched successfully",
    meta,
    data: result.data
  });
});

/**
 * Get single category by ID
 */
const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  
  if (!id) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Category ID is required", "id");
  }
  
  const result = await CategoryService.getCategoryById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category fetched successfully",
    data: result
  });
});

/**
 * Get single category by slug
 */
const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };
  
  if (!slug) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Category slug is required", "slug");
  }
  
  const result = await CategoryService.getCategoryBySlug(slug);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category fetched successfully",
    data: result
  });
});

/**
 * Update category by ID
 */
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  
  if (!id) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Category ID is required", "id");
  }
  
  const result = await CategoryService.updateCategory(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category updated successfully",
    data: result
  });
});

/**
 * Delete category by ID
 */
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  
  if (!id) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Category ID is required", "id");
  }
  
  const result = await CategoryService.deleteCategory(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category deleted successfully",
    data: null
  });
});

/**
 * Delete multiple categories at once
 */
const bulkDeleteCategories = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Category IDs are required", "ids");
  }
  
  const result = await CategoryService.bulkDeleteCategories(ids);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `${result.count} categories deleted successfully`,
    data: null
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
};