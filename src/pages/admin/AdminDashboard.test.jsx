import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { getAdminOrders } from "../../services/orderService";

jest.mock("../../services/orderService", () => ({ getAdminOrders: jest.fn() }));

test("shows a failed load and recovers on retry", async () => {
  getAdminOrders.mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce([]);
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminDashboard /></MemoryRouter>);
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.queryByText("No payment receipts are waiting for review.")).toBeNull();
  fireEvent.click(screen.getByText("Try again"));
  expect(await screen.findByText("No payment receipts are waiting for review.")).toBeTruthy();
  expect(getAdminOrders).toHaveBeenCalledTimes(2);
});
