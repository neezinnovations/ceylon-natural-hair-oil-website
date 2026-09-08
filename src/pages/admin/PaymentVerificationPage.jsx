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
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  getPaymentStatusLabel,
} from "../../constants/orderStatus";


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


export default function PaymentVerificationPage() {
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
  ] = useState("PENDING");


  async function loadOrders() {
    try {
      setLoading(true);

      setError("");


      const rows =
        await getAdminOrders();


      /*
       * IMPORTANT:
       * COD orders are intentionally
       * removed from this page.
       */

      const bankOrders =
        rows.filter(
          (order) =>
            getPaymentMethod(
              order
            ) ===
            PAYMENT_METHOD.BANK_TRANSFER
        );


      setOrders(
        bankOrders
      );

    } catch (err) {
      console.error(
        "Payment verification error:",
        err
      );


      setError(
        err?.message ||
          "Unable to load payments."
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
      return orders.filter(
        (order) => {
          const status =
            order.payment
              ?.status;


          if (
            filter ===
            "ALL"
          ) {
            return true;
          }


          if (
            filter ===
            "PENDING"
          ) {
            return (
              status ===
                PAYMENT_STATUS.SUBMITTED ||
              status ===
                "SUBMITTED"
            );
          }


          if (
            filter ===
            "VERIFIED"
          ) {
            return (
              status ===
                PAYMENT_STATUS.VERIFIED ||
              status ===
                "VERIFIED"
            );
          }


          if (
            filter ===
            "REJECTED"
          ) {
            return (
              status ===
                PAYMENT_STATUS.REJECTED ||
              status ===
                "REJECTED"
            );
          }


          return true;
        }
      );
    }, [
      orders,
      filter,
    ]);


  return (
    <div className="admin-view">

      <div className="admin-page-heading">

        <span>
          BANK TRANSFERS
        </span>


        <h1>
          Payment <em>verification.</em>
        </h1>


        <p>
          Review customer bank transfer
          receipts. Cash on Delivery orders
          do not appear here.
        </p>

      </div>


      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}


      <div className="payment-review-toolbar">

        <div className="payment-filter-tabs">

          {[
            [
              "PENDING",
              "Needs Review",
            ],
            [
              "VERIFIED",
              "Verified",
            ],
            [
              "REJECTED",
              "Rejected",
            ],
            [
              "ALL",
              "All",
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

      </div>


      {loading ? (

        <div className="admin-loading">
          Loading payments...
        </div>

      ) : filteredOrders.length ===
        0 ? (

        <div className="admin-empty-card">

          <div className="admin-empty">
            No bank payments found.
          </div>

        </div>

      ) : (

        <div className="payment-verification-list">

          {filteredOrders.map(
            (order) => (

              <article
                className="payment-verification-card"
                key={order.id}
              >

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

                </div>


                <div>

                  <span>
                    ORDER TOTAL
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
                    AMOUNT PAID
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
                    STATUS
                  </span>

                  <strong>
                    {getPaymentStatusLabel(
                      order.payment
                        ?.status
                    )}
                  </strong>

                </div>


                <Link
                  to={`/admin/orders/${order.id}`}
                >
                  Review →
                </Link>

              </article>

            )
          )}

        </div>

      )}

    </div>
  );
}