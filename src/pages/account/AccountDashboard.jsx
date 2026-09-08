import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCustomerOrders } from "../../services/orderService";
import { getOrderStatusLabel } from "../../constants/orderStatus";

export default function AccountDashboard() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState([]);
  useEffect(() => { if (user?.uid) getCustomerOrders(user.uid).then(setOrders).catch(console.error); }, [user]);
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;
  const active = orders.filter((o) => ["CONFIRMED","PROCESSING","PACKED","SHIPPED"].includes(o.status)).length;
  return <div className="account-view"><span className="account-eyebrow">MY ACCOUNT</span><h1>Hello, {profile?.name?.split(" ")[0] || "there"}.</h1><p>Track orders and manage your account details.</p><div className="account-stats"><article><span>Total Orders</span><strong>{orders.length}</strong></article><article><span>Active</span><strong>{active}</strong></article><article><span>Delivered</span><strong>{delivered}</strong></article></div><section className="account-panel"><header><h2>Recent orders</h2><Link to="/account/orders">View all</Link></header>{orders.length===0?<div className="account-empty">No orders yet.</div>:orders.slice(0,3).map((order)=><Link className="recent-order" key={order.id} to={`/account/orders/${order.id}`}><div><strong>{order.orderNumber}</strong><span>{getOrderStatusLabel(order.status)}</span></div><b>Rs. {Number(order.total||0).toLocaleString()}</b></Link>)}</section></div>;
}
