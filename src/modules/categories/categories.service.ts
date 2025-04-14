import { CategoryWithSubcategories } from '../monthly-budget/interfaces/category.interface';
import { Subcategory } from '../monthly-budget/interfaces/subcategory.interface';
import { categories } from './categories';
import { CategoriesEnum } from './categories.enum';
import { SubcategoryEnum } from './subcategories.enum';

class Categories {
  private categories: CategoryWithSubcategories[];
  private categoryMap = new Map<CategoriesEnum, CategoryWithSubcategories>();
  private subcategoryMap = new Map<
    SubcategoryEnum,
    Subcategory & { categoryName: string }
  >();

  constructor() {
    this.categories = categories;
    this._buildLookupMaps();
  }

  /**
   * Build lookup maps for categories and subcategories
   * @private
   */
  private _buildLookupMaps(): void {
    this.categoryMap.clear();
    this.subcategoryMap.clear();

    this.categories.forEach((category) => {
      this.categoryMap.set(category.id, category);

      category.subcategories.forEach((subcategory) => {
        this.subcategoryMap.set(subcategory.id, {
          ...subcategory,
          categoryName: category.name,
        });
      });
    });
  }

  /**
   * Get all categories
   * @returns All categories with their subcategories
   */
  getAllCategories(): CategoryWithSubcategories[] {
    return this.categories;
  }

  /**
   * Get all categories as a simplified array (id and name only)
   * @returns Array of category objects with id and name
   */
  getCategoriesArray(): Array<{ id: number; name: string }> {
    return this.categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }

  /**
   * Get a specific category by its ID
   * @param categoryId - The category ID
   * @returns The category object or null if not found
   */
  getCategory(categoryId: CategoriesEnum): CategoryWithSubcategories | null {
    return this.categoryMap.get(categoryId) || null;
  }

  /**
   * Get all subcategories for a specific category
   * @param categoryId - The category ID
   * @returns Array of subcategories or null if category doesn't exist
   */
  getSubcategories(categoryId: CategoriesEnum): Subcategory[] | null {
    const category = this.categoryMap.get(categoryId);
    return category ? category.subcategories : null;
  }

  /**
   * Get a specific subcategory by its ID and category ID
   * @param categoryId - The category ID
   * @param subcategoryId - The subcategory ID
   * @returns The subcategory object or null if not found
   */
  getSubcategory(
    categoryId: CategoriesEnum,
    subcategoryId: number
  ): Subcategory | null {
    const category = this.categoryMap.get(categoryId);
    if (!category) return null;

    const subcategory = category.subcategories.find(
      (sub) => sub.id === subcategoryId
    );
    return subcategory || null;
  }

  /**
   * Find a subcategory anywhere in the structure by its ID
   * @param subcategoryId - The subcategory ID to find
   * @returns The subcategory object with category info or null if not found
   */
  findSubcategoryById(
    subcategoryId: number
  ): (Subcategory & { categoryName: string }) | null {
    return this.subcategoryMap.get(subcategoryId) || null;
  }

  //   /**
  //    * Check if a subcategory is a necessity
  //    * @param subcategoryEnum - The subcategory enum value
  //    * @returns Boolean indicating if the subcategory is a necessity
  //    */
  //   isSubcategoryNecessity(subcategoryEnum: SubcategoryEnum): boolean {
  //     return this.necessityMap.get(subcategoryEnum) || false;
  //   }

  //   /**
  //    * Search for categories and subcategories by name
  //    * @param query - The search query
  //    * @returns Object with matching categories and subcategories
  //    */
  //   search(query: string): {
  //     categories: Array<{ id: string; name: string }>;
  //     subcategories: Array<Subcategory & { categoryName: string }>;
  //   } {
  //     if (!query || typeof query !== 'string') {
  //       return { categories: [], subcategories: [] };
  //     }

  //     const normalizedQuery = query.toLowerCase();
  //     const results = {
  //       categories: [] as Array<{ id: string; name: string }>,
  //       subcategories: [] as Array<Subcategory & { categoryName: string }>,
  //     };

  //     // Search categories
  //     this.categories.forEach((category) => {
  //       if (category.name.toLowerCase().includes(normalizedQuery)) {
  //         results.categories.push({
  //           id: category.id,
  //           name: category.name,
  //         });
  //       }

  //       // Search subcategories
  //       category.subcategories.forEach((subcategory) => {
  //         if (subcategory.name.toLowerCase().includes(normalizedQuery)) {
  //           results.subcategories.push({
  //             ...subcategory,
  //             categoryName: category.name,
  //           });
  //         }
  //       });
  //     });

  //     return results;
  //   }

  /**
   * Get all categories separated by necessity
   * @returns Object with necessary and non-necessary categories
   */
  getCategoriesByNecessity(): {
    necessary: Array<{
      categoryId: CategoriesEnum;
      categoryName: string;
      subcategories: Subcategory[];
    }>;
    nonNecessary: Array<{
      categoryId: CategoriesEnum;
      categoryName: string;
      subcategories: Subcategory[];
    }>;
  } {
    const result = {
      necessary: [] as Array<{
        categoryId: CategoriesEnum;
        categoryName: string;
        subcategories: Subcategory[];
      }>,
      nonNecessary: [] as Array<{
        categoryId: CategoriesEnum;
        categoryName: string;
        subcategories: Subcategory[];
      }>,
    };

    this.categories.forEach((category) => {
      // Get necessary subcategories
      const necessarySubcategories = category.subcategories.filter(
        (subcategory) => subcategory.necessity
      );

      // Get non-necessary subcategories
      const nonNecessarySubcategories = category.subcategories.filter(
        (subcategory) => !subcategory.necessity
      );

      // Add to results if there are subcategories in either category
      if (necessarySubcategories.length > 0) {
        result.necessary.push({
          categoryId: category.id,
          categoryName: category.name,
          subcategories: necessarySubcategories,
        });
      }

      if (nonNecessarySubcategories.length > 0) {
        result.nonNecessary.push({
          categoryId: category.id,
          categoryName: category.name,
          subcategories: nonNecessarySubcategories,
        });
      }
    });

    return result;
  }

  /**
   * Get a serializable representation of all categories (suitable for JSON)
   * @returns The categories structure in the original format
   */
  toJSON(): {
    categories: Array<{
      name: string;
      subCategories: Array<{ name: string; necessity: boolean }>;
    }>;
  } {
    return {
      categories: this.categories.map((category) => ({
        name: category.name,
        subCategories: category.subcategories.map((subcategory) => ({
          name: subcategory.name,
          necessity: subcategory.necessity,
        })),
      })),
    };
  }
}

const categories_list = new Categories();

export default categories_list;
