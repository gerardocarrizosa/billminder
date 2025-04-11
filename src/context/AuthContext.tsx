import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User } from '@/modules/profile/interfaces/user.interface';
import userService from '@/lib/api/users.api';
import toast from 'react-hot-toast';

type AuthContextType = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    additionalUserData: Partial<User>
  ) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  googleSignIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signup: async () => null,
  login: async () => null,
  googleSignIn: async () => null,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // Fetch user data from Firestore when authenticated
        try {
          const firestoreUser = await userService.getUserByUid(authUser.uid);
          setUser(firestoreUser);
          setFirebaseUser(authUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    try {
      if (!user) return;
      const firestoreUser = await userService.getUserByUid(user.uid);
      setUser(firestoreUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    }
  };

  const signup = async (
    email: string,
    password: string,
    additionalUserData: Partial<User>
  ): Promise<User | null> => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const newUser: User = {
        id: '',
        name: additionalUserData.name || '', // Ensure name is not empty
        email: firebaseUser.email || email,
        uid: firebaseUser.uid,
        ...additionalUserData,
      };

      // Add user to Firestore
      await userService.createUser(newUser);

      // Set user state
      setUser(newUser);
      setFirebaseUser(firebaseUser);

      toast.success('Account created successfully');
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
      return null;
    }
  };

  const googleSignIn = async (): Promise<User | null> => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Check if user already exists in Firestore
      let firestoreUser = await userService.getUserByUid(firebaseUser.uid);

      // If user doesn't exist, create a new user document
      if (!firestoreUser) {
        const newUser: User = {
          id: '',
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          uid: firebaseUser.uid,
          profilePhoto: firebaseUser.photoURL || '',
        };

        await userService.createUser(newUser);
        firestoreUser = newUser;
      }

      // Set user state
      setUser(firestoreUser);
      setFirebaseUser(firebaseUser);

      return firestoreUser;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      toast.error('Failed to sign in with Google');
      return null;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      // Login with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Fetch user data from Firestore
      const firestoreUser = await userService.getUserByUid(firebaseUser.uid);

      if (firestoreUser) {
        setUser(firestoreUser);
        setFirebaseUser(firebaseUser);
        toast.success('Logged in successfully');
        return firestoreUser;
      } else {
        // Handle case where Firestore user document doesn't exist
        toast.error('User data not found');
        return null;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in');
      return null;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Signout error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signup,
        login,
        googleSignIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
