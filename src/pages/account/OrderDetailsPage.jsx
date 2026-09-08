import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCustomerOrder } from "../../services/orderService";
import { getOrderStatusLabel, getPaymentStatusLabel } from "../../constants/orderStatus";
import { product } from "../../data/siteData";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    getCustomerOrder(orderId, user.uid)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="account-view">
        <div className="account-empty">
          Loading order...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="account-view">
        <div className="account-empty">
          Order not found.
        </div>
      </div>
    );
  }

  const rejected =
    order.payment?.status === "PAYMENT_REJECTED";

  return (
    <div className="account-view">
      <Link className="back-link" to="/account/orders">
        ← Back to orders
      </Link>

      <span className="account-eyebrow">
        ORDER DETAILS
      </span>

      <h1>{order.orderNumber}</h1>

      <div className="order-detail-status">
        <span>Order</span>
        <strong>
          {getOrderStatusLabel(order.status)}
        </strong>

        <span>Payment</span>
        <strong>
          {getPaymentStatusLabel(order.payment?.status)}
        </strong>
      </div>

      {rejected && (
        <div className="account-error">
          <strong>Payment rejected.</strong>
          <br />
          {order.payment?.rejectionReason ||
            "Please contact support."}
        </div>
      )}

      <section className="account-panel">
        <header>
          <h2>Items</h2>

          <strong>
            Rs. {Number(order.total || 0).toLocaleString()}
          </strong>
        </header>

        {order.items?.map((item, index) => (
          <div
            className="order-item"
            key={`${item.productId}-${index}`}
          >
            <img
              src={product.imageUrl}
              alt={item.name}
            />

            <div>
              <strong>{item.name}</strong>

              <span>
                {item.size} · Qty {item.quantity}
              </span>
            </div>

            <b>
              Rs. {Number(item.total || 0).toLocaleString()}
            </b>
          </div>
        ))}
      </section>

      <div className="order-detail-grid">
        <section className="account-panel padded">
          <h2>Delivery</h2>

          <p>
            <strong>
              {order.deliveryAddress?.fullName}
            </strong>
            <br />
            {order.deliveryAddress?.addressLine1}
            <br />
            {order.deliveryAddress?.addressLine2}
            <br />
            {order.deliveryAddress?.city},{" "}
            {order.deliveryAddress?.district}
            <br />
            {order.deliveryAddress?.phone}
          </p>
        </section>

        <section className="account-panel padded">
          <h2>Payment</h2>

          <p>
            Status:{" "}
            {getPaymentStatusLabel(
              order.payment?.status
            )}
            <br />
            Paid: Rs.{" "}
            {Number(
              order.payment?.amountPaid || 0
            ).toLocaleString()}
            <br />
            Reference:{" "}
            {order.payment?.transactionReference || "—"}
          </p>

          {order.payment?.receiptUrl && (
            <a
              href={order.payment.receiptUrl}
              target="_blank"
              rel="noreferrer"
            >
              View receipt
            </a>
          )}
        </section>
      </div>
    </div>
  );
}
