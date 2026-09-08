import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getAdminOrders,
} from "../../services/orderService";

import {
  getOrderStatusLabel,
  getPaymentMethodLabel,
  PAYMENT_METHOD,
} from "../../constants/orderStatus";


function formatDate(
  timestamp
) {
  try {
    if (
      timestamp?.toDate
    ) {
      return timestamp
        .toDate()
        .toLocaleString(
          "en-LK",
          {
            dateStyle:
              "medium",

            timeStyle:
              "short",
          }
        );
    }


    return "—";

  } catch {
    return "—";
  }
}


function getPaymentMethod(
  order
) {
  return (
    order?.paymentMethod ||
    order?.payment?.method ||
    PAYMENT_METHOD.BANK_TRANSFER
  );
}


function getStatusClass(
  status
) {
  switch (status) {
    case "CONFIRMED":
      return "confirmed";

    case "PROCESSING":
      return "processing";

    case "PACKED":
      return "packed";

    case "SHIPPED":
      return "shipped";

    case "DELIVERED":
      return "delivered";

    case "CANCELLED":
      return "cancelled";

    case "PAYMENT_VERIFICATION":
      return "payment";

    default:
      return "";
  }
}


export default function AdminOrdersPage() {
  const [
    orders,
    setOrders,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    filter,
    setFilter,
  ] = useState("ALL");


  const [
    search,
    setSearch,
  ] = useState("");


  async function loadOrders() {
    try {
      setLoading(true);

      setError("");


      const rows =
        await getAdminOrders();


      setOrders(
        Array.isArray(rows)
          ? rows
          : []
      );

    } catch (err) {
      console.error(
        "Admin orders error:",
        err
      );


      setError(
        err?.message ||
          "Unable to load orders."
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadOrders();
  }, []);


  const filteredOrders =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();


      return orders.filter(
        (order) => {
          const method =
            getPaymentMethod(
              order
            );


          /* ============================
             FILTER
          ============================ */

          if (
            filter ===
              "COD" &&
            method !==
              PAYMENT_METHOD.CASH_ON_DELIVERY
          ) {
            return false;
          }


          if (
            filter ===
              "BANK" &&
            method !==
              PAYMENT_METHOD.BANK_TRANSFER
          ) {
            return false;
          }


          if (
            filter ===
              "PAYMENT_VERIFICATION" &&
            order.status !==
              "PAYMENT_VERIFICATION"
          ) {
            return false;
          }


          if (
            filter ===
              "CONFIRMED" &&
            order.status !==
              "CONFIRMED"
          ) {
            return false;
          }


          if (
            filter ===
              "PROCESSING" &&
            order.status !==
              "PROCESSING"
          ) {
            return false;
          }


          if (
            filter ===
              "SHIPPED" &&
            order.status !==
              "SHIPPED"
          ) {
            return false;
          }


          if (
            filter ===
              "DELIVERED" &&
            order.status !==
              "DELIVERED"
          ) {
            return false;
          }


          if (
            filter ===
              "CANCELLED" &&
            order.status !==
              "CANCELLED"
          ) {
            return false;
          }


          /* ============================
             SEARCH
          ============================ */

          if (!term) {
            return true;
          }


          const searchable =
            [
              order.orderNumber,

              order.customer
                ?.name,

              order.customer
                ?.email,

              order.customer
                ?.phone,

              order.shippingAddress
                ?.fullName,

              order.shippingAddress
                ?.phone,

              method,

              order.status,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();


          return searchable.includes(
            term
          );
        }
      );
    }, [
      orders,
      filter,
      search,
    ]);


  return (
    <div className="admin-view">

      {/* =========================================
          HEADING
      ========================================== */}

      <div className="admin-page-heading">

        <span>
          ORDER MANAGEMENT
        </span>


        <h1>
          Customer <em>orders.</em>
        </h1>


        <p>
          Review Bank Transfer and Cash
          on Delivery orders from one place.
        </p>

      </div>


      {/* =========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}


      {/* =========================================
          TOOLBAR
      ========================================== */}

      <div className="admin-orders-toolbar">

        <div className="admin-orders-filters">

          {[
            ["ALL", "All"],
            ["COD", "COD"],
            ["BANK", "Bank"],
            [
              "PAYMENT_VERIFICATION",
              "Payment Review",
            ],
            [
              "CONFIRMED",
              "Confirmed",
            ],
            [
              "PROCESSING",
              "Processing",
            ],
            [
              "SHIPPED",
              "Shipped",
            ],
            [
              "DELIVERED",
              "Delivered",
            ],
          ].map(
            ([
              value,
              label,
            ]) => (

              <button
                type="button"
                key={value}
                className={
                  filter ===
                  value
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    value
                  )
                }
              >
                {label}
              </button>

            )
          )}

        </div>


        <input
          type="search"
          className="admin-search"
          placeholder="Search order, customer..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

      </div>


      {/* =========================================
          ORDER LIST
      ========================================== */}

      {loading ? (

        <div className="admin-loading">
          Loading orders...
        </div>

      ) : filteredOrders.length ===
        0 ? (

        <div className="admin-empty-card">

          <div className="admin-empty">

            No orders found.

          </div>

        </div>

      ) : (

        <div className="admin-orders-list">

          {filteredOrders.map(
            (order) => {
              const method =
                getPaymentMethod(
                  order
                );


              const isCod =
                method ===
                PAYMENT_METHOD.CASH_ON_DELIVERY;


              return (
                <article
                  className="admin-order-row"
                  key={order.id}
                >

                  {/* ORDER */}

                  <div>

                    <span>
                      ORDER
                    </span>

                    <strong>
                      {order.orderNumber ||
                        order.id}
                    </strong>

                    <small>
                      {formatDate(
                        order.createdAt
                      )}
                    </small>

                  </div>


                  {/* CUSTOMER */}

                  <div>

                    <span>
                      CUSTOMER
                    </span>

                    <strong>
                      {order.customer
                        ?.name ||
                        order
                          .shippingAddress
                          ?.fullName ||
                        "Customer"}
                    </strong>

                    <small>
                      {order.customer
                        ?.email ||
                        order
                          .shippingAddress
                          ?.phone ||
                        "—"}
                    </small>

                  </div>


                  {/* PAYMENT METHOD */}

                  <div>

                    <span>
                      PAYMENT
                    </span>

                    <strong
                      className={
                        isCod
                          ? "admin-payment-method-badge cod"
                          : "admin-payment-method-badge bank"
                      }
                    >
                      {getPaymentMethodLabel(
                        method
                      )}
                    </strong>

                    <small>
                      {isCod
                        ? "Pay on delivery"
                        : order.payment
                            ?.status ||
                          "Submitted"}
                    </small>

                  </div>


                  {/* TOTAL */}

                  <div>

                    <span>
                      TOTAL
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


                  {/* STATUS */}

                  <div>

                    <span>
                      STATUS
                    </span>

                    <strong
                      className={`admin-order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getOrderStatusLabel(
                        order.status
                      )}
                    </strong>

                  </div>


                  {/* VIEW */}

                  <Link
                    to={`/admin/orders/${order.id}`}
                  >
                    Review →
                  </Link>

                </article>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}