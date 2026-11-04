import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders } from "../../services/orderService";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getAdminOrders()
      .then((rows) => { if (active) setOrders(rows); })
      .catch(() => { if (active) setError("Unable to load dashboard orders. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter(
        (order) => order.payment?.status === "PAYMENT_SUBMITTED"
      ).length,
      active: orders.filter((order) =>
        ["CONFIRMED", "PROCESSING", "PACKED", "SHIPPED"].includes(
          order.status
        )
      ).length,
      delivered: orders.filter((order) => order.status === "DELIVERED")
        .length,
      revenue: orders
        .filter(
          (order) => order.payment?.status === "PAYMENT_VERIFIED"
        )
        .reduce((sum, order) => sum + Number(order.total || 0), 0),
    }),
    [orders]
  );

  const pending = orders
    .filter((order) => order.payment?.status === "PAYMENT_SUBMITTED")
    .slice(0, 5);

  if (error) return <div className="admin-alert admin-alert-error" role="alert">
    {error} <button onClick={() => setAttempt((value) => value + 1)}>Try again</button>
  </div>;

  return (
    <div className="admin-view">
      <div className="admin-page-heading">
        <span>ADMINISTRATION</span>
        <h1>
          Business <em>Overview.</em>
        </h1>
        <p>Review payments and manage customer orders.</p>
      </div>

      <div className="admin-stat-grid">
        <article>
          <span>Total Orders</span>
          <strong>{loading ? "—" : stats.total}</strong>
          <small>All orders</small>
        </article>

        <article className="admin-stat-warning">
          <span>Payment Review</span>
          <strong>{loading ? "—" : stats.pending}</strong>
          <small>Needs attention</small>
        </article>

        <article>
          <span>Active Orders</span>
          <strong>{loading ? "—" : stats.active}</strong>
          <small>In fulfilment</small>
        </article>

        <article>
          <span>Delivered</span>
          <strong>{loading ? "—" : stats.delivered}</strong>
          <small>Completed</small>
        </article>
      </div>

      <section className="admin-revenue-card">
        <div>
          <span>VERIFIED ORDER VALUE</span>
          <strong>Rs. {stats.revenue.toLocaleString()}</strong>
        </div>
        <p>Total value of orders with verified bank payments.</p>
      </section>

      <section className="admin-panel">
        <header className="admin-panel-header">
          <div>
            <span>ACTION REQUIRED</span>
            <h2>Pending payments</h2>
          </div>

          <Link to="/admin/payments">View all →</Link>
        </header>

        {pending.length === 0 ? (
          <div className="admin-empty">
            No payment receipts are waiting for review.
          </div>
        ) : (
          <div className="admin-payment-list">
            {pending.map((order) => (
              <Link
                className="admin-payment-row"
                key={order.id}
                to={`/admin/orders/${order.id}`}
              >
                <div>
                  <span>ORDER</span>
                  <strong>{order.orderNumber}</strong>
                </div>

                <div>
                  <span>CUSTOMER</span>
                  <strong>{order.customer?.name || "Customer"}</strong>
                </div>

                <div>
                  <span>AMOUNT</span>
                  <strong>
                    Rs. {Number(order.total || 0).toLocaleString()}
                  </strong>
                </div>

                <div className="admin-payment-review">
                  Review →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
