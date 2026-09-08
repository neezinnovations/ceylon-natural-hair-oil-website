import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  approveOrderPayment,
  getAdminOrder,
  rejectOrderPayment,
  updateAdminOrderStatus,
  markCashOnDeliveryPaid,
} from "../../services/orderService";

import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  getOrderStatusLabel,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
} from "../../constants/orderStatus";


const FULFILMENT_STEPS = [
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
];


function getPaymentMethod(
  order
) {
  return (
    order?.paymentMethod ||
    order?.payment?.method ||
    PAYMENT_METHOD.BANK_TRANSFER
  );
}


function formatDate(
  timestamp
) {
  try {
    return (
      timestamp
        ?.toDate?.()
        ?.toLocaleString(
          "en-LK",
          {
            dateStyle:
              "medium",

            timeStyle:
              "short",
          }
        ) ||
      "—"
    );

  } catch {
    return "—";
  }
}


export default function AdminOrderDetailsPage() {
  const {
    orderId,
  } = useParams();


  const auth =
    useAuth();


  const adminUid =
    auth?.user?.uid ||
    "";


  const [
    order,
    setOrder,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  const [
    statusNote,
    setStatusNote,
  ] = useState("");


  const [
    rejectOpen,
    setRejectOpen,
  ] = useState(false);


  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");


  /* =======================================================
     LOAD ORDER
  ======================================================= */

  async function loadOrder() {
    try {
      setLoading(true);

      setError("");


      const row =
        await getAdminOrder(
          orderId
        );


      if (!row) {
        throw new Error(
          "Order not found."
        );
      }


      setOrder(
        row
      );

    } catch (err) {
      console.error(
        "Admin order loading error:",
        err
      );


      setError(
        err?.message ||
          "Unable to load order."
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orderId,
  ]);


  const paymentMethod =
    getPaymentMethod(
      order
    );


  const isCod =
    paymentMethod ===
    PAYMENT_METHOD.CASH_ON_DELIVERY;


  const isBank =
    paymentMethod ===
    PAYMENT_METHOD.BANK_TRANSFER;


  const paymentStatus =
    order?.payment
      ?.status;


  const bankNeedsReview =
    isBank &&
    (
      paymentStatus ===
        PAYMENT_STATUS.SUBMITTED ||
      paymentStatus ===
        "SUBMITTED"
    );


  const codPaid =
    isCod &&
    (
      paymentStatus ===
        PAYMENT_STATUS.VERIFIED ||
      paymentStatus ===
        "VERIFIED"
    );


  /* =======================================================
     CURRENT FULFILMENT INDEX
  ======================================================= */

  const currentStep =
    useMemo(() => {
      return FULFILMENT_STEPS.indexOf(
        order?.status
      );
    }, [
      order?.status,
    ]);


  /* =======================================================
     APPROVE BANK PAYMENT
  ======================================================= */

  async function handleApprovePayment() {
    if (
      !order?.id ||
      saving
    ) {
      return;
    }


    try {
      setSaving(true);

      setError("");

      setSuccess("");


      await approveOrderPayment(
        order.id,
        adminUid
      );


      setSuccess(
        "Bank payment verified successfully."
      );


      await loadOrder();

    } catch (err) {
      console.error(
        "Payment approval error:",
        err
      );


      setError(
        err?.message ||
          "Unable to approve payment."
      );

    } finally {
      setSaving(false);
    }
  }


  /* =======================================================
     REJECT BANK PAYMENT
  ======================================================= */

  async function handleRejectPayment() {
    if (
      !order?.id ||
      saving
    ) {
      return;
    }


    if (
      !rejectionReason
        .trim()
    ) {
      setError(
        "Please enter a reason for rejecting the payment."
      );

      return;
    }


    try {
      setSaving(true);

      setError("");

      setSuccess("");


      await rejectOrderPayment(
        order.id,
        adminUid,
        rejectionReason.trim()
      );


      setRejectOpen(false);

      setRejectionReason("");


      setSuccess(
        "Payment rejected successfully."
      );


      await loadOrder();

    } catch (err) {
      console.error(
        "Payment rejection error:",
        err
      );


      setError(
        err?.message ||
          "Unable to reject payment."
      );

    } finally {
      setSaving(false);
    }
  }


  /* =======================================================
     UPDATE ORDER STATUS
  ======================================================= */

  async function handleStatusUpdate(
    nextStatus
  ) {
    if (
      !order?.id ||
      saving
    ) {
      return;
    }


    /*
     * Bank transfer must be verified before
     * fulfilment can continue.
     */
    if (
      isBank &&
      order.payment
        ?.status !==
        PAYMENT_STATUS.VERIFIED &&
      order.payment
        ?.status !==
        "VERIFIED" &&
      nextStatus !==
        ORDER_STATUS.CANCELLED
    ) {
      setError(
        "Verify the bank payment before changing this order to a fulfilment status."
      );

      return;
    }


    try {
      setSaving(true);

      setError("");

      setSuccess("");


      await updateAdminOrderStatus({
        orderId:
          order.id,

        adminUid,

        nextStatus,

        note:
          statusNote.trim(),
      });


      /*
       * COD:
       * Delivered normally means payment
       * was collected at delivery.
       */
      if (
        isCod &&
        nextStatus ===
          ORDER_STATUS.DELIVERED &&
        !codPaid
      ) {
        await markCashOnDeliveryPaid(
          order.id,
          adminUid
        );
      }


      setStatusNote("");


      setSuccess(
        `Order updated to ${getOrderStatusLabel(
          nextStatus
        )}.`
      );


      await loadOrder();

    } catch (err) {
      console.error(
        "Order status update error:",
        err
      );


      setError(
        err?.message ||
          "Unable to update order status."
      );

    } finally {
      setSaving(false);
    }
  }


  /* =======================================================
     MARK COD PAID MANUALLY
  ======================================================= */

  async function handleMarkCodPaid() {
    if (
      !order?.id ||
      saving
    ) {
      return;
    }


    try {
      setSaving(true);

      setError("");

      setSuccess("");


      await markCashOnDeliveryPaid(
        order.id,
        adminUid
      );


      setSuccess(
        "Cash on Delivery payment marked as collected."
      );


      await loadOrder();

    } catch (err) {
      console.error(
        "COD payment update error:",
        err
      );


      setError(
        err?.message ||
          "Unable to update COD payment."
      );

    } finally {
      setSaving(false);
    }
  }


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="admin-view">

        <div className="admin-loading">
          Loading order...
        </div>

      </div>
    );
  }


  /* =======================================================
     ERROR / MISSING ORDER
  ======================================================= */

  if (!order) {
    return (
      <div className="admin-view">

        <div className="admin-alert admin-alert-error">
          {error ||
            "Order not found."}
        </div>


        <Link
          className="admin-back-link"
          to="/admin/orders"
        >
          ← Back to orders
        </Link>

      </div>
    );
  }


  return (
    <div className="admin-view">

      {/* =========================================
          HEADING
      ========================================== */}

      <div className="admin-order-heading">

        <div>

          <Link
            className="admin-back-link"
            to="/admin/orders"
          >
            ← Back to orders
          </Link>


          <span>
            ORDER DETAILS
          </span>


          <h1>
            {order.orderNumber ||
              order.id}
          </h1>

        </div>


        <div
          className={
            isCod
              ? "admin-payment-method-badge cod"
              : "admin-payment-method-badge bank"
          }
        >
          {getPaymentMethodLabel(
            paymentMethod
          )}
        </div>

      </div>


      {/* =========================================
          MESSAGES
      ========================================== */}

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}


      {success && (
        <div className="admin-alert admin-alert-success">
          {success}
        </div>
      )}


      {/* =========================================
          MAIN ORDER LAYOUT
      ========================================== */}

      <div className="admin-order-layout">

        {/* =======================================
            LEFT
        ======================================== */}

        <div>

          {/* =====================================
              PAYMENT
          ====================================== */}

          <section className="admin-payment-details-card">

            <header>

              <div>

                <span>
                  PAYMENT
                </span>

                <h2>
                  Payment details
                </h2>

              </div>


              <div
                className={
                  isCod
                    ? "admin-payment-method-badge cod"
                    : "admin-payment-method-badge bank"
                }
              >
                {getPaymentMethodLabel(
                  paymentMethod
                )}
              </div>

            </header>


            {/* ===================================
                COD PAYMENT
            ==================================== */}

            {isCod ? (

              <>

                <div className="admin-cod-payment-panel">

                  <div className="admin-cod-payment-icon">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 7h12v10H3V7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />

                      <path
                        d="M15 10h3l3 3v4h-6v-7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />

                      <circle
                        cx="7"
                        cy="18"
                        r="1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />

                      <circle
                        cx="18"
                        cy="18"
                        r="1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />

                    </svg>

                  </div>


                  <div>

                    <span>
                      CASH ON DELIVERY
                    </span>


                    <h3>
                      {codPaid
                        ? "Payment collected."
                        : "Collect payment on delivery."}
                    </h3>


                    <p>

                      {codPaid
                        ? "The Cash on Delivery payment has been recorded as collected."
                        : "No online payment was made. Collect the full amount from the customer when delivering the order."}

                    </p>

                  </div>

                </div>


                <div className="admin-cod-payment-total">

                  <div>

                    <span>
                      Amount due
                    </span>

                    <strong>
                      Rs.{" "}
                      {Number(
                        order.payment
                          ?.amountDue ??
                          order.total ??
                          0
                      ).toLocaleString(
                        "en-LK"
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Payment status
                    </span>

                    <strong>
                      {getPaymentStatusLabel(
                        order.payment
                          ?.status
                      )}
                    </strong>

                  </div>

                </div>


                {!codPaid &&
                  order.status !==
                    ORDER_STATUS.CANCELLED && (

                  <div className="admin-cod-actions">

                    <button
                      type="button"
                      disabled={saving}
                      onClick={
                        handleMarkCodPaid
                      }
                    >
                      {saving
                        ? "Updating..."
                        : "Mark payment collected"}
                    </button>

                  </div>

                )}

              </>

            ) : (

              /* =================================
                 BANK PAYMENT
              ================================== */

              <>

                <div className="admin-bank-payment-meta">

                  <div>

                    <span>
                      Order total
                    </span>

                    <strong>
                      Rs.{" "}
                      {Number(
                        order.total ||
                          0
                      ).toLocaleString(
                        "en-LK"
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Amount paid
                    </span>

                    <strong>
                      Rs.{" "}
                      {Number(
                        order.payment
                          ?.amountPaid ||
                          0
                      ).toLocaleString(
                        "en-LK"
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Reference
                    </span>

                    <strong>
                      {order.payment
                        ?.transactionReference ||
                        "Not provided"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Payment status
                    </span>

                    <strong>
                      {getPaymentStatusLabel(
                        order.payment
                          ?.status
                      )}
                    </strong>

                  </div>

                </div>


                {/* RECEIPT */}

                {order.payment
                  ?.receiptUrl ? (

                  <div className="admin-payment-receipt">

                    <span>
                      PAYMENT RECEIPT
                    </span>


                    <a
                      href={
                        order.payment
                          .receiptUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={
                          order.payment
                            .receiptUrl
                        }
                        alt="Customer payment receipt"
                      />
                    </a>

                  </div>

                ) : (

                  <div className="admin-no-payment-receipt">
                    No payment receipt uploaded.
                  </div>

                )}


                {/* APPROVE / REJECT */}

                {bankNeedsReview && (

                  <div className="admin-bank-actions">

                    <button
                      type="button"
                      className="admin-bank-reject"
                      disabled={saving}
                      onClick={() => {
                        setError("");

                        setRejectOpen(
                          true
                        );
                      }}
                    >
                      Reject payment
                    </button>


                    <button
                      type="button"
                      className="admin-bank-approve"
                      disabled={saving}
                      onClick={
                        handleApprovePayment
                      }
                    >
                      {saving
                        ? "Verifying..."
                        : "Verify payment"}
                    </button>

                  </div>

                )}

              </>

            )}

          </section>


          {/* =====================================
              PRODUCTS
          ====================================== */}

          <section className="admin-items-card">

            <header>

              <div>

                <span>
                  ITEMS
                </span>

                <h2>
                  Ordered products
                </h2>

              </div>


              <strong>
                {order.items
                  ?.length ||
                  0}{" "}
                item(s)
              </strong>

            </header>


            {(order.items || []).map(
              (
                item,
                index
              ) => (

                <div
                  className="admin-order-item"
                  key={
                    `${item.productId}-${index}`
                  }
                >

                  <div className="admin-order-item-image">

                    <img
                      src={
                        item.imageUrl ||
                        "/images/hair_oil_bottle.webp"
                      }
                      alt={
                        item.name ||
                        "Product"
                      }
                    />

                  </div>


                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.size}
                    </span>

                  </div>


                  <div>

                    <span>
                      QUANTITY
                    </span>

                    <strong>
                      {item.quantity}
                    </strong>

                  </div>


                  <div>

                    <span>
                      UNIT PRICE
                    </span>

                    <strong>
                      Rs.{" "}
                      {Number(
                        item.price ||
                          0
                      ).toLocaleString(
                        "en-LK"
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      TOTAL
                    </span>

                    <strong>
                      Rs.{" "}
                      {Number(
                        item.lineTotal ??
                          item.price *
                            item.quantity
                      ).toLocaleString(
                        "en-LK"
                      )}
                    </strong>

                  </div>

                </div>

              )
            )}

          </section>


          {/* =====================================
              FULFILMENT
          ====================================== */}

          <section className="admin-fulfilment-card">

            <header>

              <div>

                <span>
                  FULFILMENT
                </span>

                <h2>
                  Order progress
                </h2>

              </div>


              <strong>
                {getOrderStatusLabel(
                  order.status
                )}
              </strong>

            </header>


            <div className="admin-fulfilment-progress">

              {FULFILMENT_STEPS.map(
                (
                  step,
                  index
                ) => {

                  const completed =
                    order.status ===
                      ORDER_STATUS.DELIVERED ||
                    index <=
                      currentStep;


                  return (
                    <div
                      key={step}
                      className={
                        completed
                          ? "completed"
                          : ""
                      }
                    >

                      <span>
                        {completed
                          ? "✓"
                          : index +
                            1}
                      </span>


                      <strong>
                        {getOrderStatusLabel(
                          step
                        )}
                      </strong>

                    </div>
                  );
                }
              )}

            </div>


            <label className="admin-status-note">

              <span>
                INTERNAL / STATUS NOTE
              </span>


              <input
                type="text"
                value={
                  statusNote
                }
                onChange={(event) =>
                  setStatusNote(
                    event.target.value
                  )
                }
                placeholder="Optional note"
              />

            </label>


            <div className="admin-status-actions">

              {order.status ===
                ORDER_STATUS.CONFIRMED && (

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    handleStatusUpdate(
                      ORDER_STATUS.PROCESSING
                    )
                  }
                >
                  Start processing
                </button>

              )}


              {order.status ===
                ORDER_STATUS.PROCESSING && (

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    handleStatusUpdate(
                      ORDER_STATUS.PACKED
                    )
                  }
                >
                  Mark packed
                </button>

              )}


              {order.status ===
                ORDER_STATUS.PACKED && (

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    handleStatusUpdate(
                      ORDER_STATUS.SHIPPED
                    )
                  }
                >
                  Mark shipped
                </button>

              )}


              {order.status ===
                ORDER_STATUS.SHIPPED && (

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    handleStatusUpdate(
                      ORDER_STATUS.DELIVERED
                    )
                  }
                >
                  Mark delivered
                </button>

              )}


              {order.status !==
                ORDER_STATUS.CANCELLED &&
                order.status !==
                  ORDER_STATUS.DELIVERED && (

                <button
                  type="button"
                  className="admin-cancel-order"
                  disabled={saving}
                  onClick={() =>
                    handleStatusUpdate(
                      ORDER_STATUS.CANCELLED
                    )
                  }
                >
                  Cancel order
                </button>

              )}

            </div>

          </section>

        </div>


        {/* =======================================
            RIGHT INFORMATION
        ======================================== */}

        <aside className="admin-order-information">

          {/* CUSTOMER */}

          <section className="admin-info-card">

            <header>

              <div>

                <span>
                  CUSTOMER
                </span>

                <h2>
                  Customer details
                </h2>

              </div>

            </header>


            <dl>

              <div>

                <dt>
                  Name
                </dt>

                <dd>
                  {order.customer
                    ?.name ||
                    order
                      .shippingAddress
                      ?.fullName ||
                    "—"}
                </dd>

              </div>


              <div>

                <dt>
                  Email
                </dt>

                <dd>
                  {order.customer
                    ?.email ||
                    "—"}
                </dd>

              </div>


              <div>

                <dt>
                  Phone
                </dt>

                <dd>
                  {order.customer
                    ?.phone ||
                    order
                      .shippingAddress
                      ?.phone ||
                    "—"}
                </dd>

              </div>

            </dl>

          </section>


          {/* ADDRESS */}

          <section className="admin-info-card">

            <header>

              <div>

                <span>
                  DELIVERY
                </span>

                <h2>
                  Shipping address
                </h2>

              </div>

            </header>


            <div className="admin-address">

              <strong>
                {order
                  .shippingAddress
                  ?.fullName ||
                  "Customer"}
              </strong>


              <p>
                {[
                  order
                    .shippingAddress
                    ?.addressLine1,

                  order
                    .shippingAddress
                    ?.addressLine2,

                  order
                    .shippingAddress
                    ?.city,

                  order
                    .shippingAddress
                    ?.district,

                  order
                    .shippingAddress
                    ?.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>


              <p>
                {order
                  .shippingAddress
                  ?.phone ||
                  ""}
              </p>

            </div>

          </section>


          {/* ORDER SUMMARY */}

          <section className="admin-info-card">

            <header>

              <div>

                <span>
                  SUMMARY
                </span>

                <h2>
                  Order totals
                </h2>

              </div>

            </header>


            <dl>

              <div>

                <dt>
                  Created
                </dt>

                <dd>
                  {formatDate(
                    order.createdAt
                  )}
                </dd>

              </div>


              <div>

                <dt>
                  Payment
                </dt>

                <dd>
                  {getPaymentMethodLabel(
                    paymentMethod
                  )}
                </dd>

              </div>


              <div>

                <dt>
                  Subtotal
                </dt>

                <dd>
                  Rs.{" "}
                  {Number(
                    order.subtotal ||
                      0
                  ).toLocaleString(
                    "en-LK"
                  )}
                </dd>

              </div>


              <div>

                <dt>
                  Delivery
                </dt>

                <dd>
                  {Number(
                    order.deliveryFee ||
                      0
                  ) === 0
                    ? "Free"
                    : `Rs. ${Number(
                        order.deliveryFee
                      ).toLocaleString(
                        "en-LK"
                      )}`}
                </dd>

              </div>


              <div>

                <dt>
                  Total
                </dt>

                <dd>
                  <strong>
                    Rs.{" "}
                    {Number(
                      order.total ||
                        0
                    ).toLocaleString(
                      "en-LK"
                    )}
                  </strong>
                </dd>

              </div>

            </dl>

          </section>

        </aside>

      </div>


      {/* =========================================
          BANK REJECTION MODAL
      ========================================== */}

      {rejectOpen && (

        <>

          <button
            type="button"
            className="admin-modal-overlay"
            aria-label="Close modal"
            onClick={() => {
              if (!saving) {
                setRejectOpen(
                  false
                );
              }
            }}
          />


          <div className="admin-reject-modal">

            <header>

              <h2>
                Reject payment
              </h2>


              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  setRejectOpen(
                    false
                  )
                }
              >
                ×
              </button>

            </header>


            <p>
              Tell the customer why the
              bank transfer could not be
              verified.
            </p>


            <textarea
              value={
                rejectionReason
              }
              onChange={(event) =>
                setRejectionReason(
                  event.target.value
                )
              }
              placeholder="Example: Amount does not match the order total."
            />


            <div className="admin-modal-actions">

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  setRejectOpen(
                    false
                  )
                }
              >
                Cancel
              </button>


              <button
                type="button"
                disabled={
                  saving ||
                  !rejectionReason
                    .trim()
                }
                onClick={
                  handleRejectPayment
                }
              >
                {saving
                  ? "Rejecting..."
                  : "Reject payment"}
              </button>

            </div>

          </div>

        </>

      )}

    </div>
  );
}