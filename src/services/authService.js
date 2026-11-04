import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export async function registerCustomer({ name, email, phone, password }) {
  name = name.trim();
  phone = phone.trim();
  email = email.trim();
  if (!name || name.length > 120 || !phone || phone.length > 30) {
    throw new Error("Please enter a valid name and phone number.");
  }
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  try {
    await updateProfile(user, { displayName: name.trim() });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name.trim(),
      email: user.email,
      phone: phone.trim(),
      role: "customer",
      status: "active",
      defaultAddressId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    try {
      await deleteUser(user);
    } catch {
      await signOut(auth).catch(() => {});
      const failure = new Error("Account setup could not be completed.");
      failure.code = "app/account-setup-incomplete";
      throw failure;
    }
    throw error;
  }
  return credential;
}

export function loginCustomer(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser() {
  return signOut(auth);
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(uid) {
  if (!uid) return null;
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function updateCustomerProfile(uid, { name, phone }) {
  await updateDoc(doc(db, "users", uid), {
    name: name.trim(),
    phone: phone.trim(),
    updatedAt: serverTimestamp(),
  });

  if (auth.currentUser && name.trim() !== auth.currentUser.displayName) {
    await updateProfile(auth.currentUser, { displayName: name.trim() });
  }
}
