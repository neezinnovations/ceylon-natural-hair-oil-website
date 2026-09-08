import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  getCustomerOrders,
} from "../../services/orderService";

import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from "../../constants/orderStatus";


function formatDate(timestamp) {
  try {
    return (
      timestamp
        ?.toDate?.()
        .toLocaleDateString(
          "en-LK",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ) || "—"
    );
  } catch {
    return "—";
  }
}


function getDisplayStatus(order) {
  if (
    order?.payment?.status ===
    "PAYMENT_REJECTED"
  ) {
    return getPaymentStatusLabel(
      order.payment.status
    );
  }

  return getOrderStatusLabel(
    order?.status
  );
}


export default function OrdersPage() {
  const {
    user,
  } = useAuth();


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
    searchParams,
  ] = useSearchParams();


  const placedOrderNumber =
    searchParams.get("placed");


  /* ===============================================
     LOAD CUSTOMER ORDERS
  ================================================ */

  useEffect(() => {
    if (!user?.uid) {
      return;
    }


    let active = true;


    const loadOrders =
      async () => {
        try {
          setLoading(true);

          setError("");


          const customerOrders =
            await getCustomerOrders(
              user.uid
            );


          if (active) {
            setOrders(
              customerOrders
            );
          }
        } catch (err) {
          console.error(
            "Failed to load orders:",
            err
          );


          if (active) {
            setError(
              "Unable to load your orders. Please try again."
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };


    loadOrders();


    return () => {
      active = false;
    };
  }, [
    user?.uid,
  ]);


  return (
    <div className="account-view">

      {/* ===========================================
          PAGE HEADING
      ============================================ */}

      <div className="account-page-heading">

        <span className="account-eyebrow">
          ORDERS
        </span>

        <h1>
          My orders.
        </h1>

        <p>
          View your orders, payment status,
          and delivery progress.
        </p>

      </div>


      {/* ===========================================
          ORDER SUCCESS MESSAGE
      ============================================ */}

      {placedOrderNumber && (
        <div className="account-success">

          Order{" "}
          <strong>
            {placedOrderNumber}
          </strong>{" "}
          was submitted successfully.
          Payment is currently under review.

        </div>
      )}


      {/* ===========================================
          ERROR
      ============================================ */}

      {error && (
        <div className="account-error">
          {error}
        </div>
      )}


      {/* ===========================================
          LOADING
      ============================================ */}

      {loading ? (

        <div className="account-empty">
          Loading orders...
        </div>

      ) : orders.length === 0 ? (

        /* =========================================
           EMPTY STATE
        ========================================== */

        <div className="account-empty">

          <h3>
            No orders yet.
          </h3>

          <p>
            You haven't placed an order yet.
          </p>

          <Link
            to="/"
            className="account-shop-link"
          >
            Shop now
          </Link>

        </div>

      ) : (

        /* =========================================
           ORDER LIST
        ========================================== */

        <div className="orders-list">

          {orders.map(
            (order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="order-card"
              >

                {/* ORDER */}

                <div className="order-card-info">

                  <span>
                    {formatDate(
                      order.createdAt
                    )}
                  </span>

                  <strong>
                    {order.orderNumber ||
                      "Order"}
                  </strong>

                </div>


                {/* STATUS */}

                <div className="order-card-info">

                  <span>
                    Status
                  </span>

                  <strong>
                    {getDisplayStatus(
                      order
                    )}
                  </strong>

                </div>


                {/* TOTAL */}

                <div className="order-card-info">

                  <span>
                    Total
                  </span>

                  <strong>
                    Rs.{" "}
                    {Number(
                      order.total || 0
                    ).toLocaleString(
                      "en-LK"
                    )}
                  </strong>

                </div>


                {/* VIEW */}

                <div className="order-card-action">
                  View
                  <span>→</span>
                </div>

              </Link>
            )
          )}

        </div>

      )}

    </div>
  );
}