import Category from "../models/category.model";

export class CategoryService {
  /**
   * Get all categories
   */
  static async getAllCategories() {
    return Category.find().sort({ createdAt: -1 }).lean();
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string) {
    return Category.findOne({ slug }).lean();
  }

  /**
   * Create category
   */
  static async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    thumbnailUrl?: string;
  }) {
    const exists = await Category.findOne({ slug: data.slug });
    if (exists) throw new Error("Category already exists");

    return Category.create({
      name: data.name.trim(),
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      slug: data.slug.trim(),
    });
  }
}
export const categoryService = CategoryService;