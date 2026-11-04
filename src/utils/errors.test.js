import { getErrorMessage, safeReceiptUrl } from "./errors";

test.each([
  "javascript:alert(1)", "data:text/html,test", "http://res.cloudinary.com/a/image/upload/b",
  "https://res.cloudinary.com.evil.example/a", "https://evil.example/receipt.png",
  "https://user:secret@res.cloudinary.com/a", null,
])("rejects unsafe receipt URL %s", (url) => {
  expect(safeReceiptUrl(url)).toBe("");
});

test("allows HTTPS Cloudinary receipts", () => {
  const url = "https://res.cloudinary.com/shop/image/upload/receipt.png";
  expect(safeReceiptUrl(url)).toBe(url);
});

test("does not expose backend error details", () => {
  expect(getErrorMessage(new Error("Internal project details"), "Unable to sign in.")).toBe("Unable to sign in.");
  expect(getErrorMessage({ code: "auth/user-not-found" })).toBe(getErrorMessage({ code: "auth/wrong-password" }));
});
