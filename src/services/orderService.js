import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  db,
} from "../firebase/firebase";

import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../constants/orderStatus";


/* =========================================================
   ORDER NUMBER
========================================================= */

function buildOrderNumber(
  orderId
) {
  const date =
    new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "");


  const suffix =
    orderId
      .slice(-6)
      .toUpperCase();


  return `CNC-${date}-${suffix}`;
}


/* =========================================================
   NORMALIZE ITEMS
========================================================= */

function normalizeItems(
  items = []
) {
  return items.map(
    (item) => {
      const price =
        Number(
          item.price || 0
        );


      const quantity =
        Math.max(
          1,
          Number(
            item.quantity || 1
          )
        );


      return {
        productId:
          item.productId ||
          "",

        name:
          item.name ||
          "",

        size:
          item.size ||
          "",

        price,

        quantity,

        lineTotal:
          price *
          quantity,

        imageUrl:
          item.imageUrl ||
          "",
      };
    }
  );
}


/* =========================================================
   NORMALIZE ADDRESS
========================================================= */

function normalizeAddress(
  address
) {
  return {
    id:
      address?.id ||
      "",

    label:
      address?.label ||
      "Address",

    fullName:
      address?.fullName ||
      "",

    phone:
      address?.phone ||
      "",

    addressLine1:
      address?.addressLine1 ||
      "",

    addressLine2:
      address?.addressLine2 ||
      "",

    city:
      address?.city ||
      "",

    district:
      address?.district ||
      "",

    postalCode:
      address?.postalCode ||
      "",
  };
}


/* =========================================================
   NORMALIZE CUSTOMER
========================================================= */

function normalizeCustomer(
  user,
  customer
) {
  return {
    uid:
      user?.uid ||
      "",

    email:
      user?.email ||
      customer?.email ||
      "",

    name:
      customer?.displayName ||
      customer?.fullName ||
      user?.displayName ||
      "",

    phone:
      customer?.phone ||
      "",
  };
}


/* =========================================================
   CALCULATE TOTAL
========================================================= */

function calculateTotal(
  items
) {
  return items.reduce(
    (
      sum,
      item
    ) => {
      return (
        sum +
        Number(
          item.lineTotal ||
          0
        )
      );
    },
    0
  );
}


/* =========================================================
   GET PAYMENT METHOD FROM ORDER

   Supports new and older order documents.
========================================================= */

function getOrderPaymentMethod(
  order
) {
  return (
    order?.paymentMethod ||
    order?.payment?.method ||
    PAYMENT_METHOD.BANK_TRANSFER
  );
}


/* =========================================================
   CREATE BANK TRANSFER ORDER
========================================================= */

export async function createBankTransferOrder({
  user,
  customer,
  address,
  items,
  receiptUrl,
  transactionReference = "",
  amountPaid,
}) {
  if (!user?.uid) {
    throw new Error(
      "User authentication is required."
    );
  }


  if (!address) {
    throw new Error(
      "Delivery address is required."
    );
  }


  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new Error(
      "Order items are required."
    );
  }


  if (!receiptUrl) {
    throw new Error(
      "Payment receipt is required."
    );
  }


  const normalizedItems =
    normalizeItems(
      items
    );


  const subtotal =
    calculateTotal(
      normalizedItems
    );


  const deliveryFee =
    0;


  const total =
    subtotal +
    deliveryFee;


  const orderRef =
    doc(
      collection(
        db,
        "orders"
      )
    );


  const orderNumber =
    buildOrderNumber(
      orderRef.id
    );


  await setDoc(
    orderRef,
    {
      orderNumber,

      userId:
        user.uid,

      customer:
        normalizeCustomer(
          user,
          customer
        ),

      shippingAddress:
        normalizeAddress(
          address
        ),

      items:
        normalizedItems,

      subtotal,

      deliveryFee,

      total,

      currency:
        "LKR",

      paymentMethod:
        PAYMENT_METHOD.BANK_TRANSFER,

      payment: {
        method:
          PAYMENT_METHOD.BANK_TRANSFER,

        status:
          PAYMENT_STATUS.SUBMITTED,

        receiptUrl,

        transactionReference:
          transactionReference
            ?.trim() ||
          "",

        amountPaid:
          Number(
            amountPaid ??
            total
          ),

        amountDue:
          0,

        rejectionReason:
          "",

        verifiedBy:
          "",

        rejectedBy:
          "",
      },

      status:
        ORDER_STATUS.PAYMENT_VERIFICATION,

      statusNote:
        "Bank transfer submitted for verification.",

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    }
  );


  return {
    id:
      orderRef.id,

    orderNumber,
  };
}


/* =========================================================
   CREATE CASH ON DELIVERY ORDER
========================================================= */

export async function createCashOnDeliveryOrder({
  user,
  customer,
  address,
  items,
  amountDue,
}) {
  if (!user?.uid) {
    throw new Error(
      "User authentication is required."
    );
  }


  if (!address) {
    throw new Error(
      "Delivery address is required."
    );
  }


  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new Error(
      "Order items are required."
    );
  }


  const normalizedItems =
    normalizeItems(
      items
    );


  const subtotal =
    calculateTotal(
      normalizedItems
    );


  const deliveryFee =
    0;


  const total =
    subtotal +
    deliveryFee;


  const orderRef =
    doc(
      collection(
        db,
        "orders"
      )
    );


  const orderNumber =
    buildOrderNumber(
      orderRef.id
    );


  await setDoc(
    orderRef,
    {
      orderNumber,

      userId:
        user.uid,

      customer:
        normalizeCustomer(
          user,
          customer
        ),

      shippingAddress:
        normalizeAddress(
          address
        ),

      items:
        normalizedItems,

      subtotal,

      deliveryFee,

      total,

      currency:
        "LKR",

      paymentMethod:
        PAYMENT_METHOD.CASH_ON_DELIVERY,

      payment: {
        method:
          PAYMENT_METHOD.CASH_ON_DELIVERY,

        status:
          PAYMENT_STATUS.PENDING,

        receiptUrl:
          "",

        transactionReference:
          "",

        amountPaid:
          0,

        amountDue:
          Number(
            amountDue ??
            total
          ),

        rejectionReason:
          "",

        verifiedBy:
          "",

        rejectedBy:
          "",
      },

      /*
       * COD does not require
       * bank-payment verification.
       */

      status:
        ORDER_STATUS.CONFIRMED,

      statusNote:
        "Cash on Delivery order confirmed.",

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    }
  );


  return {
    id:
      orderRef.id,

    orderNumber,
  };
}


/* =========================================================
   GET CUSTOMER ORDERS
========================================================= */

export async function getCustomerOrders(
  userId
) {
  if (!userId) {
    return [];
  }


  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "orders"
        ),

        where(
          "userId",
          "==",
          userId
        )
      )
    );


  const rows =
    snapshot.docs.map(
      (orderDocument) => ({
        id:
          orderDocument.id,

        ...orderDocument.data(),
      })
    );


  return rows.sort(
    (
      first,
      second
    ) => {
      const firstTime =
        first.createdAt
          ?.toMillis?.() ||
        0;


      const secondTime =
        second.createdAt
          ?.toMillis?.() ||
        0;


      return (
        secondTime -
        firstTime
      );
    }
  );
}


/* =========================================================
   GET CUSTOMER ORDER
========================================================= */

export async function getCustomerOrder(
  userId,
  orderId
) {
  if (
    !userId ||
    !orderId
  ) {
    return null;
  }


  const orderRef =
    doc(
      db,
      "orders",
      orderId
    );


  const snapshot =
    await getDoc(
      orderRef
    );


  if (!snapshot.exists()) {
    return null;
  }


  const data =
    snapshot.data();


  if (
    data.userId !==
    userId
  ) {
    throw new Error(
      "You do not have permission to view this order."
    );
  }


  return {
    id:
      snapshot.id,

    ...data,
  };
}


/* =========================================================
   GET ADMIN ORDERS
========================================================= */

export async function getAdminOrders() {
  const snapshot =
    await getDocs(
      collection(
        db,
        "orders"
      )
    );


  const rows =
    snapshot.docs.map(
      (orderDocument) => ({
        id:
          orderDocument.id,

        ...orderDocument.data(),
      })
    );


  return rows.sort(
    (
      first,
      second
    ) => {
      const firstTime =
        first.createdAt
          ?.toMillis?.() ||
        0;


      const secondTime =
        second.createdAt
          ?.toMillis?.() ||
        0;


      return (
        secondTime -
        firstTime
      );
    }
  );
}


/* =========================================================
   GET ADMIN ORDER
========================================================= */

export async function getAdminOrder(
  orderId
) {
  if (!orderId) {
    return null;
  }


  const snapshot =
    await getDoc(
      doc(
        db,
        "orders",
        orderId
      )
    );


  if (!snapshot.exists()) {
    return null;
  }


  return {
    id:
      snapshot.id,

    ...snapshot.data(),
  };
}


/* =========================================================
   APPROVE ORDER PAYMENT

   IMPORTANT:
   This is the ORIGINAL function name your
   AdminOrderDetailsPage already imports.
========================================================= */

export async function approveOrderPayment(
  orderId,
  adminUid = ""
) {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }


  const orderRef =
    doc(
      db,
      "orders",
      orderId
    );


  const snapshot =
    await getDoc(
      orderRef
    );


  if (!snapshot.exists()) {
    throw new Error(
      "Order not found."
    );
  }


  const order =
    snapshot.data();


  const paymentMethod =
    getOrderPaymentMethod(
      order
    );


  if (
    paymentMethod ===
    PAYMENT_METHOD.CASH_ON_DELIVERY
  ) {
    throw new Error(
      "Cash on Delivery orders do not require bank payment verification."
    );
  }


  await updateDoc(
    orderRef,
    {
      "payment.status":
        PAYMENT_STATUS.VERIFIED,

      "payment.verifiedBy":
        adminUid || "",

      "payment.verifiedAt":
        serverTimestamp(),

      "payment.rejectionReason":
        "",

      status:
        ORDER_STATUS.CONFIRMED,

      statusNote:
        "Bank payment verified.",

      updatedAt:
        serverTimestamp(),
    }
  );


  return {
    id:
      orderId,

    status:
      ORDER_STATUS.CONFIRMED,

    paymentStatus:
      PAYMENT_STATUS.VERIFIED,
  };
}


/* =========================================================
   NEWER ALIAS
========================================================= */

export async function verifyBankTransferPayment(
  orderId,
  adminUid = ""
) {
  return approveOrderPayment(
    orderId,
    adminUid
  );
}


/* =========================================================
   REJECT ORDER PAYMENT

   IMPORTANT:
   Existing AdminOrderDetailsPage uses:
   rejectOrderPayment(orderId, adminUid, reason)
========================================================= */

export async function rejectOrderPayment(
  orderId,
  adminUid = "",
  reason = ""
) {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }


  if (!reason?.trim()) {
    throw new Error(
      "Please enter a reason for rejecting the payment."
    );
  }


  const orderRef =
    doc(
      db,
      "orders",
      orderId
    );


  const snapshot =
    await getDoc(
      orderRef
    );


  if (!snapshot.exists()) {
    throw new Error(
      "Order not found."
    );
  }


  const order =
    snapshot.data();


  const paymentMethod =
    getOrderPaymentMethod(
      order
    );


  if (
    paymentMethod ===
    PAYMENT_METHOD.CASH_ON_DELIVERY
  ) {
    throw new Error(
      "Cash on Delivery orders do not have a bank payment to reject."
    );
  }


  await updateDoc(
    orderRef,
    {
      "payment.status":
        PAYMENT_STATUS.REJECTED,

      "payment.rejectionReason":
        reason.trim(),

      "payment.rejectedBy":
        adminUid || "",

      "payment.rejectedAt":
        serverTimestamp(),

      status:
        ORDER_STATUS.PAYMENT_VERIFICATION,

      statusNote:
        "Bank payment rejected.",

      updatedAt:
        serverTimestamp(),
    }
  );


  return {
    id:
      orderId,

    status:
      ORDER_STATUS.PAYMENT_VERIFICATION,

    paymentStatus:
      PAYMENT_STATUS.REJECTED,
  };
}


/* =========================================================
   NEWER REJECT ALIAS

   New component can call:
   rejectBankTransferPayment(orderId, reason)

   It also accepts:
   rejectBankTransferPayment(orderId, reason, adminUid)
========================================================= */

export async function rejectBankTransferPayment(
  orderId,
  reason = "",
  adminUid = ""
) {
  return rejectOrderPayment(
    orderId,
    adminUid,
    reason
  );
}


/* =========================================================
   UPDATE ADMIN ORDER STATUS

   IMPORTANT:
   Original AdminOrderDetailsPage uses this function.
========================================================= */

export async function updateAdminOrderStatus({
  orderId,
  adminUid = "",
  nextStatus,
  note = "",
}) {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }


  if (!nextStatus) {
    throw new Error(
      "Order status is required."
    );
  }


  const validStatuses =
    Object.values(
      ORDER_STATUS
    );


  if (
    !validStatuses.includes(
      nextStatus
    )
  ) {
    throw new Error(
      "Invalid order status."
    );
  }


  const orderRef =
    doc(
      db,
      "orders",
      orderId
    );


  const snapshot =
    await getDoc(
      orderRef
    );


  if (!snapshot.exists()) {
    throw new Error(
      "Order not found."
    );
  }


  await updateDoc(
    orderRef,
    {
      status:
        nextStatus,

      statusNote:
        note?.trim() ||
        "",

      lastUpdatedBy:
        adminUid || "",

      updatedAt:
        serverTimestamp(),
    }
  );


  return {
    id:
      orderId,

    status:
      nextStatus,
  };
}


/* =========================================================
   NEWER STATUS UPDATE ALIAS

   Supports newer code:
   updateOrderStatus(orderId, status, note)
========================================================= */

export async function updateOrderStatus(
  orderId,
  status,
  note = "",
  adminUid = ""
) {
  return updateAdminOrderStatus({
    orderId,

    adminUid,

    nextStatus:
      status,

    note,
  });
}
/* =========================================================
   MARK CASH ON DELIVERY PAYMENT COLLECTED
========================================================= */

export async function markCashOnDeliveryPaid(
  orderId,
  adminUid = ""
) {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }


  const orderRef =
    doc(
      db,
      "orders",
      orderId
    );


  const snapshot =
    await getDoc(
      orderRef
    );


  if (!snapshot.exists()) {
    throw new Error(
      "Order not found."
    );
  }


  const order =
    snapshot.data();


  const paymentMethod =
    order.paymentMethod ||
    order.payment?.method;


  if (
    paymentMethod !==
    PAYMENT_METHOD.CASH_ON_DELIVERY
  ) {
    throw new Error(
      "This order is not a Cash on Delivery order."
    );
  }


  const total =
    Number(
      order.total ||
      0
    );


  await updateDoc(
    orderRef,
    {
      "payment.status":
        PAYMENT_STATUS.VERIFIED,

      "payment.amountPaid":
        total,

      "payment.amountDue":
        0,

      "payment.collectedBy":
        adminUid || "",

      "payment.collectedAt":
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    }
  );


  return {
    id:
      orderId,

    paymentStatus:
      PAYMENT_STATUS.VERIFIED,
  };
}