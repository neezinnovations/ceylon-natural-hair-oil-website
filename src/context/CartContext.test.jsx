import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import { product } from "../data/siteData";

function Cart() {
  const { cartItems, total, addItem } = useCart();
  return <><span data-testid="cart">{JSON.stringify({ cartItems, total })}</span>
    <button onClick={() => addItem({ ...product, price: 1 }, 1000)}>Add</button></>;
}

beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());

test.each(['{}', 'null', 'broken json', '[null]'])("recovers from malformed stored cart %s", (stored) => {
  localStorage.setItem("ceylon-natural-care-cart", stored);
  render(<CartProvider><Cart /></CartProvider>);
  expect(JSON.parse(screen.getByTestId("cart").textContent).cartItems).toEqual([]);
});

test("replaces manipulated stored prices with catalog values and caps quantities", () => {
  localStorage.setItem("ceylon-natural-care-cart", JSON.stringify([{ ...product, price: 1, quantity: 1000 }]));
  render(<CartProvider><Cart /></CartProvider>);
  const cart = JSON.parse(screen.getByTestId("cart").textContent);
  expect(cart.total).toBe(product.price * 99);
});

test("continues using the cart when storage writes fail", () => {
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
  render(<CartProvider><Cart /></CartProvider>);
  fireEvent.click(screen.getByText("Add"));
  expect(JSON.parse(screen.getByTestId("cart").textContent).total).toBe(product.price * 99);
});
