import { doc, setDoc } from "firebase/firestore";
import { createCashOnDeliveryOrder } from "./orderService";
import { product } from "../data/siteData";

jest.mock("../firebase/firebase", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(), doc: jest.fn(() => ({ id: "order123456" })),
  getDoc: jest.fn(), getDocs: jest.fn(), query: jest.fn(), where: jest.fn(),
  serverTimestamp: jest.fn(), setDoc: jest.fn(), updateDoc: jest.fn(),
}));

const order = { user: { uid: "customer", email: "customer@example.com" }, address: { fullName: "Customer" },
  items: [{ ...product, quantity: 2 }] };

beforeEach(() => {
  setDoc.mockClear();
  doc.mockReturnValue({ id: "order123456" });
});

test("ignores altered client price and amount due", async () => {
  await createCashOnDeliveryOrder({ ...order, items: [{ ...product, price: 1, quantity: 2 }], amountDue: 1 });
  expect(setDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
    total: product.price * 2, payment: expect.objectContaining({ amountDue: product.price * 2 }),
  }));
});

test.each([0, -1, 1.5, 100, Infinity, NaN])("rejects invalid order quantity %s", async (quantity) => {
  await expect(createCashOnDeliveryOrder({ ...order, items: [{ ...product, quantity }] })).rejects.toThrow();
  expect(setDoc).not.toHaveBeenCalled();
});
