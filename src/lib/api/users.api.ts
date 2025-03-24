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
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust the import path to your Firebase config
import { User } from '@/modules/profile/interfaces/user.interface';

class UserService {
  private usersCollection = collection(db, 'Users');

  // Create a new user
  async createUser(userData: User): Promise<string> {
    try {
      // Omit the 'id' if present as Firestore will generate it
      const { id, ...userDataWithoutId } = userData;

      // Add the document to the collection
      const docRef = await addDoc(this.usersCollection, userDataWithoutId);

      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Read a user by their document ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'Users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Read a user by their Firebase Auth UID
  async getUserByUid(uid: string): Promise<User | null> {
    try {
      const q = query(this.usersCollection, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user by UID:', error);
      throw error;
    }
  }

  // Update a user by their document ID
  async updateUser(userId: string, updateData: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, 'Users', userId);

      // Remove undefined values to prevent overwriting with undefined
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(docRef, cleanedUpdateData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete a user by their document ID
  async deleteUser(userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'Users', userId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get all users (use with caution in production)
  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(this.usersCollection);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as User)
      );
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  // Optional: Find users by a specific field
  async findUsersByField(field: keyof User, value: string): Promise<User[]> {
    try {
      const q = query(this.usersCollection, where(field, '==', value));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as User)
      );
    } catch (error) {
      console.error(`Error finding users by ${field}:`, error);
      throw error;
    }
  }
}

export const userService = new UserService();

export default userService;
