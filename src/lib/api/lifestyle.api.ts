import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Lifestyle,
  LifestyleBudget,
} from '@/modules/monthly-budget/interfaces/lifestyle.interface';

class LifestyleService {
  private collectionName = 'Lifestyle';
  private collection = collection(db, this.collectionName);

  /**
   * Create a new lifestyle budget document
   * @param data Lifestyle data with budgets array
   * @returns Promise with the new document ID
   */
  async create(data: Lifestyle): Promise<string> {
    try {
      // Omit the 'id' if present as Firestore will generate it
      const { id, ...dataWithoutId } = data;

      const docRef = await addDoc(this.collection, dataWithoutId);
      return docRef.id;
    } catch (error) {
      console.error('Error creating lifestyle budget:', error);
      throw error;
    }
  }

  /**
   * Get a lifestyle budget document by ID
   * @param id Document ID
   * @returns Lifestyle document or null if not found
   */
  async getById(id: string): Promise<Lifestyle | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...(docSnap.data() as Omit<Lifestyle, 'id'>),
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting lifestyle budget:', error);
      throw error;
    }
  }

  /**
   * Get all lifestyle budget documents for a specific user
   * @param userId User ID
   * @returns Array of Lifestyle documents
   */
  async getByUserId(userId: string): Promise<Lifestyle | null> {
    try {
      const q = query(this.collection, where('userId', '==', userId));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      // Should be only one document per user
      const docSnap = querySnapshot.docs[0];

      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<Lifestyle, 'id'>),
      };
    } catch (error) {
      console.error('Error getting lifestyle budgets:', error);
      throw error;
    }
  }

  /**
   * Save or update a lifestyle budget document
   * If user already has a document, update it; otherwise create a new one
   * @param data Lifestyle data with budgets array
   * @returns Document ID of the saved lifestyle budget
   */
  async save(data: Lifestyle): Promise<string> {
    try {
      if (!data.userId) {
        throw new Error('Missing required userId field');
      }

      // Check if user already has a lifestyle document
      const existingDoc = await this.getByUserId(data.userId);

      if (existingDoc) {
        // Update existing document
        const docRef = doc(db, this.collectionName, existingDoc.id!);

        const { id, ...updateData } = data;
        await updateDoc(docRef, updateData);

        return existingDoc.id!;
      } else {
        // Create new document
        return await this.create(data);
      }
    } catch (error) {
      console.error('Error saving lifestyle budget:', error);
      throw error;
    }
  }

  /**
   * Update budget amount for a specific subcategory
   * @param userId User ID
   * @param subcategoryId Subcategory ID
   * @param budget New budget amount
   * @returns Promise resolving when complete
   */
  async updateBudget(
    userId: string,
    subcategoryId: number,
    budget: number
  ): Promise<void> {
    try {
      // Get user's lifestyle document
      const lifestyle = await this.getByUserId(userId);

      if (!lifestyle) {
        // Create a new document with this budget
        await this.create({
          userId,
          income: 0, // Default income value
          budgets: [{ subcategoryId, budget }],
        });
        return;
      }

      // Update or add the budget for this subcategory
      let budgetUpdated = false;
      const updatedBudgets = lifestyle.budgets.map((item) => {
        if (item.subcategoryId === subcategoryId) {
          budgetUpdated = true;
          return { ...item, budget };
        }
        return item;
      });

      // If budget didn't exist, add it
      if (!budgetUpdated) {
        updatedBudgets.push({ subcategoryId, budget });
      }

      // Update the document
      const docRef = doc(db, this.collectionName, lifestyle.id!);
      await updateDoc(docRef, { budgets: updatedBudgets });
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  /**
   * Update multiple budgets at once
   * @param userId User ID
   * @param budgets Array of budget items to update
   * @returns Promise resolving when complete
   */
  async updateBudgets(
    userId: string,
    budgets: LifestyleBudget[]
  ): Promise<void> {
    try {
      if (!budgets.length) return;

      // Get user's lifestyle document
      const lifestyle = await this.getByUserId(userId);

      if (!lifestyle) {
        // Create a new document with these budgets
        await this.create({
          userId,
          income: 0, // Default income value
          budgets,
        });
        return;
      }

      // Create a map of subcategoryId to budget for quick lookup
      const budgetMap: Record<number, LifestyleBudget> = {};
      budgets.forEach((budget) => {
        budgetMap[budget.subcategoryId] = budget;
      });

      // Update existing budgets and keep those not in the new budgets array
      const existingBudgetsToKeep = lifestyle.budgets.filter(
        (item) => !budgetMap[item.subcategoryId]
      );

      // Combine existing budgets to keep with new/updated budgets
      const updatedBudgets = [...existingBudgetsToKeep, ...budgets];

      // Update the document
      const docRef = doc(db, this.collectionName, lifestyle.id!);
      await updateDoc(docRef, { budgets: updatedBudgets });
    } catch (error) {
      console.error('Error updating budgets:', error);
      throw error;
    }
  }

  /**
   * Update income amount
   * @param userId User ID
   * @param income New income amount
   * @returns Promise resolving when complete
   */
  async updateIncome(userId: string, income: number): Promise<void> {
    try {
      // Get user's lifestyle document
      const lifestyle = await this.getByUserId(userId);

      if (!lifestyle) {
        // Create a new document with this income
        await this.create({
          userId,
          income,
          budgets: [],
        });
        return;
      }

      // Update the document
      const docRef = doc(db, this.collectionName, lifestyle.id!);
      await updateDoc(docRef, { income });
    } catch (error) {
      console.error('Error updating income:', error);
      throw error;
    }
  }

  /**
   * Delete a lifestyle budget document
   * @param id Document ID
   * @returns Promise resolving when delete is complete
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error) {
      console.error('Error deleting lifestyle budget:', error);
      throw error;
    }
  }

  /**
   * Remove a specific subcategory budget
   * @param userId User ID
   * @param subcategoryId Subcategory ID to remove
   * @returns Promise resolving when complete
   */
  async removeBudget(userId: string, subcategoryId: number): Promise<void> {
    try {
      // Get user's lifestyle document
      const lifestyle = await this.getByUserId(userId);

      if (!lifestyle) {
        return; // Nothing to remove
      }

      // Filter out the budget for this subcategory
      const updatedBudgets = lifestyle.budgets.filter(
        (item) => item.subcategoryId !== subcategoryId
      );

      // Update the document
      const docRef = doc(db, this.collectionName, lifestyle.id!);
      await updateDoc(docRef, { budgets: updatedBudgets });
    } catch (error) {
      console.error('Error removing budget:', error);
      throw error;
    }
  }
}

// Create single instance
const lifestyleService = new LifestyleService();

export default lifestyleService;
