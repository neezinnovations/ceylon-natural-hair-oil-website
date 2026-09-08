/* =========================================================
   ORDER STATUS
========================================================= */

export const ORDER_STATUS = {
  PAYMENT_VERIFICATION:
    "PAYMENT_VERIFICATION",

  CONFIRMED:
    "CONFIRMED",

  PROCESSING:
    "PROCESSING",

  PACKED:
    "PACKED",

  SHIPPED:
    "SHIPPED",

  DELIVERED:
    "DELIVERED",

  CANCELLED:
    "CANCELLED",
};


/* =========================================================
   PAYMENT METHODS
========================================================= */

export const PAYMENT_METHOD = {
  BANK_TRANSFER:
    "BANK_TRANSFER",

  CASH_ON_DELIVERY:
    "CASH_ON_DELIVERY",
};


/* =========================================================
   PAYMENT STATUS

   IMPORTANT:
   Keep the original values because your existing
   Account/Admin pages already use these values.
========================================================= */

export const PAYMENT_STATUS = {
  PENDING:
    "PAYMENT_PENDING",

  SUBMITTED:
    "PAYMENT_SUBMITTED",

  VERIFIED:
    "PAYMENT_VERIFIED",

  REJECTED:
    "PAYMENT_REJECTED",
};


/* =========================================================
   ORDER STATUS LABELS
========================================================= */

export const ORDER_STATUS_LABELS = {
  PAYMENT_VERIFICATION:
    "Payment Under Review",

  CONFIRMED:
    "Confirmed",

  PROCESSING:
    "Processing",

  PACKED:
    "Packed",

  SHIPPED:
    "Shipped",

  DELIVERED:
    "Delivered",

  CANCELLED:
    "Cancelled",
};


/* =========================================================
   PAYMENT STATUS LABELS
========================================================= */

export const PAYMENT_STATUS_LABELS = {
  PAYMENT_PENDING:
    "Payment Pending",

  PAYMENT_SUBMITTED:
    "Under Review",

  PAYMENT_VERIFIED:
    "Verified",

  PAYMENT_REJECTED:
    "Payment Rejected",

  /*
   * Compatibility with any orders created while
   * the temporary newer constants were being used.
   */

  PENDING:
    "Payment Pending",

  SUBMITTED:
    "Under Review",

  VERIFIED:
    "Verified",

  REJECTED:
    "Payment Rejected",
};


/* =========================================================
   PAYMENT METHOD LABELS
========================================================= */

export const PAYMENT_METHOD_LABELS = {
  BANK_TRANSFER:
    "Bank Transfer",

  CASH_ON_DELIVERY:
    "Cash on Delivery",
};


/* =========================================================
   GET ORDER STATUS LABEL
========================================================= */

export function getOrderStatusLabel(
  status
) {
  if (!status) {
    return "Unknown";
  }


  return (
    ORDER_STATUS_LABELS[
      status
    ] ||
    formatFallbackLabel(
      status
    )
  );
}


/* =========================================================
   GET PAYMENT STATUS LABEL
========================================================= */

export function getPaymentStatusLabel(
  status
) {
  if (!status) {
    return "Unknown";
  }


  return (
    PAYMENT_STATUS_LABELS[
      status
    ] ||
    formatFallbackLabel(
      status
    )
  );
}


/* =========================================================
   GET PAYMENT METHOD LABEL
========================================================= */

export function getPaymentMethodLabel(
  method
) {
  if (!method) {
    return "Unknown";
  }


  return (
    PAYMENT_METHOD_LABELS[
      method
    ] ||
    formatFallbackLabel(
      method
    )
  );
}


/* =========================================================
   FALLBACK LABEL
========================================================= */

function formatFallbackLabel(
  value
) {
  return String(value)
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}