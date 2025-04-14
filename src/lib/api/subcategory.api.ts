// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   updateDoc,
//   where,
// } from 'firebase/firestore';
// import { db } from '../firebase';
// import { Subcategory } from '@/modules/monthly-budget/interfaces/subcategory.interface';

// class SubcategoryService {
//   private collectionName = 'Subcategories';
//   private collection = collection(db, this.collectionName);

//   async create(data: Subcategory): Promise<string> {
//     try {
//       const { id, ...dataWithoutId } = data;
//       const docRef = await addDoc(this.collection, dataWithoutId);
//       return docRef.id;
//     } catch (error) {
//       console.error('Error creating subcategory:', error);
//       throw error;
//     }
//   }

//   async getAll(): Promise<Subcategory[]> {
//     try {
//       const querySnapshot = await getDocs(this.collection);
//       const subcategories: Subcategory[] = [];
//       querySnapshot.forEach((doc) => {
//         subcategories.push({
//           id: doc.id,
//           ...doc.data(),
//         } as Subcategory);
//       });
//       return subcategories;
//     } catch (error) {
//       console.error('Error fetching subcategories:', error);
//       throw error;
//     }
//   }

//   async getAllByCategoryId(categoryId: string): Promise<Subcategory[]> {
//     try {
//       const q = query(this.collection, where('categoryId', '==', categoryId));
//       const querySnapshot = await getDocs(q);
//       const subcategories: Subcategory[] = [];
//       querySnapshot.forEach((doc) => {
//         subcategories.push({
//           id: doc.id,
//           ...doc.data(),
//         } as Subcategory);
//       });
//       return subcategories;
//     } catch (error) {
//       console.error('Error fetching subcategories by categoryId:', error);
//       throw error;
//     }
//   }

//   async getById(id: string): Promise<Subcategory | null> {
//     try {
//       const docRef = doc(db, this.collectionName, id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         return {
//           id: docSnap.id,
//           ...docSnap.data(),
//         } as Subcategory;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error fetching subcategory:', error);
//       throw error;
//     }
//   }

//   async update(id: string, updateData: Partial<Subcategory>): Promise<void> {
//     try {
//       const docRef = doc(db, this.collectionName, id);
//       const cleanedData = Object.fromEntries(
//         Object.entries(updateData).filter(([_, v]) => v !== undefined)
//       );
//       await updateDoc(docRef, cleanedData);
//     } catch (error) {
//       console.error('Error updating subcategory:', error);
//       throw error;
//     }
//   }

//   async delete(id: string): Promise<void> {
//     try {
//       const docRef = doc(db, this.collectionName, id);
//       await deleteDoc(docRef);
//     } catch (error) {
//       console.error('Error deleting subcategory:', error);
//       throw error;
//     }
//   }
// }

// export const subcategoryService = new SubcategoryService();
// export default subcategoryService;
