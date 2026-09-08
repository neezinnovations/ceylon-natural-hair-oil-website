import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useCart,
} from "../../context/CartContext";

import {
  getAddresses,
} from "../../services/addressService";

import {
  uploadReceipt,
} from "../../services/receiptUploadService";

import {
  createBankTransferOrder,
  createCashOnDeliveryOrder,
} from "../../services/orderService";

import {
  PAYMENT_METHOD,
} from "../../constants/orderStatus";

import {
  bankDetails,
  product,
} from "../../data/siteData";

import "./Checkout.css";


export default function CheckoutPage() {
  const {
    user,
    profile,
  } = useAuth();


  const {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    total,
  } = useCart();


  const navigate =
    useNavigate();


  /* =======================================================
     STATE
  ======================================================= */

  const [
    addresses,
    setAddresses,
  ] = useState([]);


  const [
    selectedId,
    setSelectedId,
  ] = useState("");


  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState(
    PAYMENT_METHOD.CASH_ON_DELIVERY
  );


  const [
    receipt,
    setReceipt,
  ] = useState(null);


  const [
    reference,
    setReference,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    placing,
    setPlacing,
  ] = useState(false);


  /* =======================================================
     LOAD SAVED ADDRESSES
  ======================================================= */

  useEffect(() => {
    if (!user?.uid) {
      return;
    }


    let active = true;


    async function loadAddresses() {
      try {
        setError("");


        const rows =
          await getAddresses(
            user.uid
          );


        if (!active) {
          return;
        }


        setAddresses(
          Array.isArray(rows)
            ? rows
            : []
        );


        const preferredAddress =
          rows?.find(
            (address) =>
              address.id ===
              profile?.defaultAddressId
          ) ||
          rows?.[0];


        setSelectedId(
          preferredAddress?.id ||
          ""
        );

      } catch (err) {
        console.error(
          "Address loading error:",
          err
        );


        if (active) {
          setError(
            err?.message ||
              "Unable to load your delivery addresses."
          );
        }
      }
    }


    loadAddresses();


    return () => {
      active = false;
    };

  }, [
    user?.uid,
    profile?.defaultAddressId,
  ]);


  /* =======================================================
     SELECTED ADDRESS
  ======================================================= */

  const selectedAddress =
    useMemo(() => {
      return addresses.find(
        (address) =>
          address.id ===
          selectedId
      );
    }, [
      addresses,
      selectedId,
    ]);


  /* =======================================================
     RECEIPT
  ======================================================= */

  function handleReceiptChange(
    event
  ) {
    const file =
      event.target.files?.[0] ||
      null;


    if (!file) {
      setReceipt(null);
      return;
    }


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      event.target.value = "";

      setReceipt(null);

      setError(
        "Please upload a JPG, PNG or WEBP image."
      );

      return;
    }


    const maxSize =
      5 * 1024 * 1024;


    if (
      file.size >
      maxSize
    ) {
      event.target.value = "";

      setReceipt(null);

      setError(
        "Payment receipt must be smaller than 5MB."
      );

      return;
    }


    setReceipt(
      file
    );

    setError("");
  }


  /* =======================================================
     CHANGE PAYMENT METHOD
  ======================================================= */

  function changePaymentMethod(
    method
  ) {
    if (placing) {
      return;
    }


    setPaymentMethod(
      method
    );


    /*
     * Do NOT require bank receipt when
     * user switches to COD.
     */

    setError("");
  }


  /* =======================================================
     PLACE ORDER
  ======================================================= */

  async function handlePlaceOrder() {
    if (placing) {
      return;
    }


    try {
      setError("");


      /* ===================================================
         LOGIN
      =================================================== */

      if (!user?.uid) {
        throw new Error(
          "Please sign in before placing your order."
        );
      }


      /* ===================================================
         CART
      =================================================== */

      if (
        !Array.isArray(
          cartItems
        ) ||
        cartItems.length === 0
      ) {
        throw new Error(
          "Your cart is empty."
        );
      }


      /* ===================================================
         ADDRESS
      =================================================== */

      if (!selectedAddress) {
        throw new Error(
          "Please add and select a delivery address."
        );
      }


      setPlacing(true);


      let result;


      /* ===================================================
         CASH ON DELIVERY
      =================================================== */

      if (
        paymentMethod ===
        PAYMENT_METHOD.CASH_ON_DELIVERY
      ) {
        console.log(
          "Creating COD order..."
        );


        result =
          await createCashOnDeliveryOrder({
            user,

            customer:
              profile || {},

            address:
              selectedAddress,

            items:
              cartItems,

            amountDue:
              Number(total),
          });


        console.log(
          "COD order created:",
          result
        );
      }


      /* ===================================================
         BANK TRANSFER
      =================================================== */

      else if (
        paymentMethod ===
        PAYMENT_METHOD.BANK_TRANSFER
      ) {
        if (!receipt) {
          throw new Error(
            "Please upload your bank transfer receipt."
          );
        }


        console.log(
          "Uploading bank receipt..."
        );


        const uploadedReceipt =
          await uploadReceipt(
            receipt
          );


        if (
          !uploadedReceipt?.secureUrl
        ) {
          throw new Error(
            "Receipt upload failed. Please try again."
          );
        }


        console.log(
          "Creating bank transfer order..."
        );


        result =
          await createBankTransferOrder({
            user,

            customer:
              profile || {},

            address:
              selectedAddress,

            items:
              cartItems,

            receiptUrl:
              uploadedReceipt.secureUrl,

            transactionReference:
              reference.trim(),

            amountPaid:
              Number(total),
          });
      }


      /* ===================================================
         UNKNOWN PAYMENT METHOD
      =================================================== */

      else {
        throw new Error(
          "Please select a payment method."
        );
      }


      /* ===================================================
         CHECK RESULT
      =================================================== */

      if (
        !result?.orderNumber
      ) {
        throw new Error(
          "Order was not created correctly. Please try again."
        );
      }


      /* ===================================================
         CLEAR CART
      =================================================== */

      clearCart();


      /* ===================================================
         GO TO ORDERS PAGE
      =================================================== */

      navigate(
        `/account/orders?placed=${encodeURIComponent(
          result.orderNumber
        )}`,
        {
          replace: true,
        }
      );

    } catch (err) {
      console.error(
        "ORDER CREATION FAILED:",
        err
      );


      setError(
        err?.message ||
          "Unable to place your order."
      );

    } finally {
      setPlacing(false);
    }
  }


  /* =======================================================
     BUTTON DISABLED
  ======================================================= */

  const isBankTransfer =
    paymentMethod ===
    PAYMENT_METHOD.BANK_TRANSFER;


  const placeOrderDisabled =
    placing ||
    !selectedAddress ||
    !user?.uid ||
    !cartItems?.length ||
    (
      isBankTransfer &&
      !receipt
    );


  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (
    !cartItems ||
    cartItems.length === 0
  ) {
    return (
      <main className="checkout-page">

        <div className="checkout-empty">

          <span>
            YOUR CART
          </span>


          <h1>
            Your cart is empty.
          </h1>


          <p>
            Add LACeylon Herbal Hair Oil
            to continue to checkout.
          </p>


          <Link to="/">
            Return to shop
          </Link>

        </div>

      </main>
    );
  }


  return (
    <main className="checkout-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="checkout-header">

        <Link
          to="/"
          className="checkout-logo"
        >
          <img
            src="/images/logo.webp"
            alt="Ceylon Natural Care"
          />
        </Link>


        <div className="checkout-secure">

          <span className="checkout-secure-dot" />

          <span>
            Secure checkout
          </span>

        </div>

      </header>


      {/* =================================================
          LAYOUT
      ================================================= */}

      <div className="checkout-layout">

        {/* =================================================
            LEFT
        ================================================= */}

        <section className="checkout-main">

          <span className="checkout-eyebrow">
            CHECKOUT
          </span>


          <h1>
            Complete your
            <br />
            order.
          </h1>


          <p className="checkout-intro">
            Confirm your delivery address
            and choose how you would like
            to pay for your order.
          </p>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="checkout-error">

              <strong>
                Unable to place order
              </strong>

              <span>
                {error}
              </span>

            </div>
          )}


          {/* =================================================
              STEP 01 — ADDRESS
          ================================================= */}

          <div className="checkout-card">

            <header className="checkout-card-header">

              <div>

                <span className="checkout-step">
                  STEP 01
                </span>

                <h2>
                  Delivery address
                </h2>

              </div>


              <Link to="/account/addresses">
                Manage
              </Link>

            </header>


            {addresses.length === 0 ? (

              <div className="checkout-no-address">

                <p>
                  You don't have a saved
                  delivery address yet.
                </p>


                <Link to="/account/addresses">
                  Add delivery address
                </Link>

              </div>

            ) : (

              <div className="checkout-addresses">

                {addresses.map(
                  (address) => (

                    <label
                      key={
                        address.id
                      }
                      className={
                        selectedId ===
                        address.id
                          ? "checkout-address-option selected"
                          : "checkout-address-option"
                      }
                    >

                      <input
                        type="radio"
                        name="deliveryAddress"
                        value={
                          address.id
                        }
                        checked={
                          selectedId ===
                          address.id
                        }
                        onChange={() => {
                          setSelectedId(
                            address.id
                          );

                          setError("");
                        }}
                      />


                      <div className="checkout-address-radio" />


                      <div className="checkout-address-content">

                        <strong>
                          {address.label ||
                            "Address"}
                        </strong>


                        <span>
                          {address.fullName}
                        </span>


                        <p>
                          {[
                            address.addressLine1,
                            address.addressLine2,
                            address.city,
                            address.district,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              ", "
                            )}
                        </p>


                        <span>
                          {address.phone}
                        </span>

                      </div>


                      {address.id ===
                        profile?.defaultAddressId && (

                        <span className="checkout-default-badge">
                          Default
                        </span>

                      )}

                    </label>

                  )
                )}

              </div>

            )}

          </div>


          {/* =================================================
              STEP 02 — PAYMENT
          ================================================= */}

          <div className="checkout-card checkout-payment-card">

            <header className="checkout-card-header">

              <div>

                <span className="checkout-step">
                  STEP 02
                </span>

                <h2>
                  Payment method
                </h2>

              </div>

            </header>


            <p className="checkout-card-description">
              Choose Cash on Delivery or
              Bank Transfer.
            </p>


            {/* =================================================
                PAYMENT METHOD BUTTONS
            ================================================= */}

            <div className="payment-method-tabs">

              {/* COD */}

              <button
                type="button"
                className={
                  paymentMethod ===
                  PAYMENT_METHOD.CASH_ON_DELIVERY
                    ? "payment-method-tab active"
                    : "payment-method-tab"
                }
                onClick={() =>
                  changePaymentMethod(
                    PAYMENT_METHOD.CASH_ON_DELIVERY
                  )
                }
              >

                <span className="payment-method-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
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

                </span>


                <span className="payment-method-copy">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <small>
                    Pay when your order arrives
                  </small>

                </span>


                <span className="payment-tab-check">
                  ✓
                </span>

              </button>


              {/* BANK */}

              <button
                type="button"
                className={
                  paymentMethod ===
                  PAYMENT_METHOD.BANK_TRANSFER
                    ? "payment-method-tab active"
                    : "payment-method-tab"
                }
                onClick={() =>
                  changePaymentMethod(
                    PAYMENT_METHOD.BANK_TRANSFER
                  )
                }
              >

                <span className="payment-method-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >

                    <path
                      d="M3 9h18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />

                    <path
                      d="M5 9v8M9 9v8M15 9v8M19 9v8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />

                    <path
                      d="M2 18h20M12 3l9 4H3l9-4Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />

                  </svg>

                </span>


                <span className="payment-method-copy">

                  <strong>
                    Bank Transfer
                  </strong>

                  <small>
                    Transfer and upload receipt
                  </small>

                </span>


                <span className="payment-tab-check">
                  ✓
                </span>

              </button>

            </div>


            {/* =================================================
                COD CONTENT
            ================================================= */}

            {paymentMethod ===
              PAYMENT_METHOD.CASH_ON_DELIVERY && (

              <div className="payment-method-content">

                <div className="cod-panel">

                  <div className="cod-panel-icon">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <path
                        d="M4 5h16v14H4V5Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />

                      <path
                        d="M8 9h8M8 13h5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />

                    </svg>

                  </div>


                  <div>

                    <span className="payment-panel-label">
                      CASH ON DELIVERY
                    </span>


                    <h3>
                      Pay when your order arrives.
                    </h3>


                    <p>
                      No bank transfer or
                      payment receipt is required.
                      Pay the delivery amount
                      when you receive your order.
                    </p>

                  </div>

                </div>


                <div className="cod-payment-summary">

                  <span>
                    Amount to pay on delivery
                  </span>


                  <strong>
                    Rs.{" "}
                    {Number(
                      total
                    ).toLocaleString(
                      "en-LK"
                    )}
                  </strong>

                </div>


                <div className="payment-info-note">

                  <span>
                    i
                  </span>


                  <p>
                    Your Cash on Delivery order
                    will be created immediately.
                  </p>

                </div>

              </div>

            )}


            {/* =================================================
                BANK CONTENT
            ================================================= */}

            {paymentMethod ===
              PAYMENT_METHOD.BANK_TRANSFER && (

              <div className="payment-method-content">

                <div className="bank-payment-intro">

                  <span className="payment-panel-label">
                    BANK TRANSFER
                  </span>


                  <h3>
                    Transfer the order total.
                  </h3>


                  <p>
                    Transfer your payment to
                    the account below and upload
                    the receipt for verification.
                  </p>

                </div>


                {/* BANK DETAILS */}

                <div className="bank-box">

                  <div>

                    <span>
                      Bank
                    </span>

                    <strong>
                      {bankDetails.bankName}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Account name
                    </span>

                    <strong>
                      {bankDetails.accountName}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Account number
                    </span>

                    <strong>
                      {bankDetails.accountNumber}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Branch
                    </span>

                    <strong>
                      {bankDetails.branch}
                    </strong>

                  </div>

                </div>


                {bankDetails.instructions && (

                  <div className="bank-instructions">
                    {bankDetails.instructions}
                  </div>

                )}


                {/* RECEIPT */}

                <label className="upload-label">

                  <span className="checkout-field-label">

                    Payment receipt

                    <small>
                      Required
                    </small>

                  </span>


                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleReceiptChange
                    }
                  />


                  <div
                    className={
                      receipt
                        ? "checkout-upload-box has-file"
                        : "checkout-upload-box"
                    }
                  >

                    <span className="upload-icon">
                      ↑
                    </span>


                    <div>

                      <strong>
                        {receipt
                          ? receipt.name
                          : "Choose payment receipt"}
                      </strong>


                      <span>
                        JPG, PNG or WEBP · Maximum 5MB
                      </span>

                    </div>

                  </div>

                </label>


                {/* TRANSACTION REFERENCE */}

                <label className="checkout-field">

                  <span>

                    Transaction reference

                    <small>
                      Optional
                    </small>

                  </span>


                  <input
                    type="text"
                    value={
                      reference
                    }
                    onChange={(
                      event
                    ) => {
                      setReference(
                        event.target.value
                      );
                    }}
                    placeholder="Bank transaction reference"
                  />

                </label>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <aside className="checkout-summary">

          <div className="checkout-summary-header">

            <span>
              YOUR ORDER
            </span>


            <h2>
              Order summary
            </h2>

          </div>


          {/* =================================================
              ITEMS
          ================================================= */}

          <div className="summary-items">

            {cartItems.map(
              (item) => (

                <div
                  className="summary-item"
                  key={
                    item.productId
                  }
                >

                  <div className="summary-item-image">

                    <img
                      src={
                        item.imageUrl ||
                        product.imageUrl
                      }
                      alt={
                        item.name
                      }
                    />

                  </div>


                  <div className="summary-item-details">

                    <strong>
                      {item.name}
                    </strong>


                    <span>
                      {item.size}
                    </span>


                    <div className="qty-row">

                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </button>


                      <span>
                        {item.quantity}
                      </span>


                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>


                      <button
                        type="button"
                        className="summary-remove"
                        onClick={() =>
                          removeItem(
                            item.productId
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>


                  <strong className="summary-item-price">

                    Rs.{" "}
                    {Number(
                      item.price *
                        item.quantity
                    ).toLocaleString(
                      "en-LK"
                    )}

                  </strong>

                </div>

              )
            )}

          </div>


          {/* =================================================
              PAYMENT METHOD SUMMARY
          ================================================= */}

          <div className="summary-payment-method">

            <span>
              PAYMENT METHOD
            </span>


            <div>

              <strong>

                {paymentMethod ===
                PAYMENT_METHOD.CASH_ON_DELIVERY
                  ? "Cash on Delivery"
                  : "Bank Transfer"}

              </strong>


              <small>

                {paymentMethod ===
                PAYMENT_METHOD.CASH_ON_DELIVERY
                  ? "Pay when your order arrives"
                  : "Bank payment verification required"}

              </small>

            </div>

          </div>


          {/* =================================================
              TOTAL
          ================================================= */}

          <div className="summary-total">

            <div>

              <span>
                Subtotal
              </span>


              <strong>
                Rs.{" "}
                {Number(
                  total
                ).toLocaleString(
                  "en-LK"
                )}
              </strong>

            </div>


            <div>

              <span>
                Delivery
              </span>


              <strong className="free-delivery">
                Free
              </strong>

            </div>


            <div className="summary-grand-total">

              <span>
                Total
              </span>


              <strong>
                Rs.{" "}
                {Number(
                  total
                ).toLocaleString(
                  "en-LK"
                )}
              </strong>

            </div>

          </div>


          {/* =================================================
              PLACE ORDER
          ================================================= */}

          <button
            type="button"
            className="place-order"
            disabled={
              placeOrderDisabled
            }
            onClick={
              handlePlaceOrder
            }
          >

            {placing
              ? "Placing order..."
              : paymentMethod ===
                PAYMENT_METHOD.CASH_ON_DELIVERY
              ? "Place Cash on Delivery Order"
              : "Submit Bank Transfer Order"}

          </button>


          <p className="checkout-verification-note">

            {paymentMethod ===
            PAYMENT_METHOD.CASH_ON_DELIVERY
              ? "No payment receipt is required. Pay when your order is delivered."
              : "Your order will be confirmed after your bank payment is verified."}

          </p>

        </aside>

      </div>

    </main>
  );
}