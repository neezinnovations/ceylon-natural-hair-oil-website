import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function getAddresses(uid) {
  const snapshot = await getDocs(collection(db, "users", uid, "addresses"));
  const addresses = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  addresses.sort((a, b) => {
    const at = a.createdAt?.toMillis?.() || (a.createdAt?.seconds || 0) * 1000;
    const bt = b.createdAt?.toMillis?.() || (b.createdAt?.seconds || 0) * 1000;
    return bt - at;
  });
  return addresses;
}

export async function addAddress(uid, values) {
  const ref = await addDoc(collection(db, "users", uid, "addresses"), {
    label: values.label?.trim() || "Home",
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    phone2: values.phone2?.trim() || "",
    addressLine1: values.addressLine1.trim(),
    addressLine2: values.addressLine2?.trim() || "",
    city: values.city.trim(),
    district: values.district.trim(),
    postalCode: values.postalCode?.trim() || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAddress(uid, addressId, values) {
  await updateDoc(doc(db, "users", uid, "addresses", addressId), {
    label: values.label?.trim() || "Home",
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    phone2: values.phone2?.trim() || "",
    addressLine1: values.addressLine1.trim(),
    addressLine2: values.addressLine2?.trim() || "",
    city: values.city.trim(),
    district: values.district.trim(),
    postalCode: values.postalCode?.trim() || "",
    updatedAt: serverTimestamp(),
  });
}

export function deleteAddress(uid, addressId) {
  return deleteDoc(doc(db, "users", uid, "addresses", addressId));
}

export function setDefaultAddress(uid, addressId) {
  return updateDoc(doc(db, "users", uid), {
    defaultAddressId: addressId,
    updatedAt: serverTimestamp(),
  });
}
