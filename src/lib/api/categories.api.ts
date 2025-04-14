import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Category,
  categorySchema,
} from '@/modules/monthly-budget/interfaces/category.interface';

class CategoriesService {
  private collectionName = 'Categories';
  private collection = collection(db, this.collectionName);

  async create(data: Omit<Category, 'id'>): Promise<string> {
    try {
      // Validate data
      await categorySchema.validate(data, { abortEarly: false });

      // Convert Date to Firestore Timestamp
      const firestoreData = {
        ...data,
        createdAt: Timestamp.fromDate(data.createdAt),
      };

      const docRef = await addDoc(this.collection, firestoreData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async getAll(): Promise<Category[]> {
    try {
      const q = query(this.collection, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);

      const categories: Category[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          id: doc.id,
          name: data.name,
          color: data.color,
          createdAt: data.createdAt.toDate(), // Convert Timestamp back to Date
        });
      });

      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
  async getAll2() {
    try {
      const q = query(this.collection);
      const querySnapshot = await getDocs(q);

      const categories: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          id: doc.id,
          name: data.name,
          color: data.color,
          createdAt: data.createdAt.toDate(), // Convert Timestamp back to Date
        });
      });

      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Category | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name,
          color: data.color,
          createdAt: data.createdAt.toDate(), // Convert Timestamp back to Date
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async getByName(name: string): Promise<Category[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('name', '==', name)
      );

      const querySnapshot = await getDocs(q);

      const categories: Category[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          id: doc.id,
          name: data.name,
          color: data.color,
          createdAt: data.createdAt.toDate(), // Convert Timestamp back to Date
        });
      });

      return categories;
    } catch (error) {
      console.error('Error fetching categories by name:', error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<Category>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);

      // Remove id from update data if present
      const { id: _, ...dataWithoutId } = updateData;

      // Convert Date to Firestore Timestamp if present
      const firestoreData: Record<string, any> = { ...dataWithoutId };
      if (firestoreData.createdAt instanceof Date) {
        firestoreData.createdAt = Timestamp.fromDate(firestoreData.createdAt);
      }

      // Remove undefined values to prevent overwriting with undefined
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(firestoreData).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(docRef, cleanedUpdateData);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();

export default categoriesService;
