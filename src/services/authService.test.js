import { createUserWithEmailAndPassword, deleteUser, signOut, updateProfile } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { registerCustomer } from "./authService";

jest.mock("../firebase/firebase", () => ({ auth: {}, db: {} }));
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(), deleteUser: jest.fn(), signOut: jest.fn(),
  updateProfile: jest.fn(), sendPasswordResetEmail: jest.fn(), signInWithEmailAndPassword: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(), serverTimestamp: jest.fn(), setDoc: jest.fn(), getDoc: jest.fn(), updateDoc: jest.fn(),
}));

const form = { name: "Customer", phone: "0771234567", email: "customer@example.com", password: "password123" };
beforeEach(() => {
  jest.resetAllMocks();
  createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: "customer", email: form.email } });
  updateProfile.mockResolvedValue();
  deleteUser.mockResolvedValue();
  signOut.mockResolvedValue();
});

test("removes newly created authentication account if profile creation fails", async () => {
  const failure = new Error("Firestore unavailable");
  setDoc.mockRejectedValue(failure);
  await expect(registerCustomer(form)).rejects.toBe(failure);
  expect(deleteUser).toHaveBeenCalledWith(expect.objectContaining({ uid: "customer" }));
});

test("signs out and explains recovery when account rollback also fails", async () => {
  setDoc.mockRejectedValue(new Error("Firestore unavailable"));
  deleteUser.mockRejectedValue(new Error("Network unavailable"));
  await expect(registerCustomer(form)).rejects.toMatchObject({ code: "app/account-setup-incomplete" });
  expect(signOut).toHaveBeenCalled();
});

test("rejects invalid profile before creating an authentication account", async () => {
  await expect(registerCustomer({ ...form, name: " " })).rejects.toThrow();
  expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
});
