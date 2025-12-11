import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { FavoriteCategory } from '@/modules/categories/interfaces/favorite-category.interface';

class FavoriteCategoriesService {
  private collectionName = 'FavoriteCategories';
  private collection = collection(db, this.collectionName);

  async create(userId: string, categoryId: number, subcategoryId: number): Promise<string> {
    try {
      // Check limit
      const currentFavorites = await this.getAllByUserId(userId);
      if (currentFavorites.length >= 10) {
        throw new Error('Maximum limit of 10 favorite categories reached.');
      }

      const docRef = await addDoc(this.collection, {
        userId,
        categoryId,
        subcategoryId,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating favorite category:', error);
      throw error;
    }
  }

  async getAllByUserId(userId: string): Promise<FavoriteCategory[]> {
    try {
      const q = query(
        this.collection,
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      const favorites: FavoriteCategory[] = [];
      querySnapshot.forEach((doc) => {
        favorites.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        } as FavoriteCategory);
      });

      return favorites;
    } catch (error) {
      console.error('Error fetching favorite categories:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Omit<FavoriteCategory, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating favorite category:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting favorite category:', error);
      throw error;
    }
  }
}

export const favoriteCategoriesService = new FavoriteCategoriesService();
export default favoriteCategoriesService;
