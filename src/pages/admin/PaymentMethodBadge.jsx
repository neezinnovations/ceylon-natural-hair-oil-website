export default function PaymentMethodBadge({
  order,
}) {
  const method =
    order?.paymentMethod ||
    order?.payment?.method ||
    "BANK_TRANSFER";


  const isCod =
    method ===
    "CASH_ON_DELIVERY";


  return (
    <span
      className={
        isCod
          ? "admin-payment-method-badge cod"
          : "admin-payment-method-badge bank"
      }
    >
      {isCod
        ? "Cash on Delivery"
        : "Bank Transfer"}
    </span>
  );
}