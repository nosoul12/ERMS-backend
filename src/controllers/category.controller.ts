import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

/**
 * @route GET /api/categories
 */
export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await CategoryService.getAllCategories();

    return res.json({
      success: true,
      message: "Categories fetched",
      data: {
        count: categories.length,
        categories,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch categories",
    });
  }
}

/**
 * @route GET /api/categories/:slug
 */
export async function getCategoryBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const category = await CategoryService.getCategoryBySlug(slug);

    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    return res.json({
      success: true,
      data: category,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch category",
    });
  }
}

/**
 * @route POST /api/categories
 */
export async function createCategory(req: Request, res: Response) {
  try {
    const { name, slug, description, thumbnailUrl } = req.body;

    if (!name || !slug)
      return res
        .status(400)
        .json({ success: false, message: "Name and slug are required" });

    const category = await CategoryService.createCategory({
      name,
      slug,
      description,
      thumbnailUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err: any) {
    // Custom error handling from service
    const status = err.message === "Category already exists" ? 400 : 500;

    return res.status(status).json({
      success: false,
      message: err.message || "Failed to create category",
    });
  }
}
