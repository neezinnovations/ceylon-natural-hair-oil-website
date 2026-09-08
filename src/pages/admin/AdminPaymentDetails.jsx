import PaymentMethodBadge
  from "./PaymentMethodBadge";


export default function AdminPaymentDetails({
  order,
  onApprove,
  onReject,
  busy = false,
}) {
  if (!order) {
    return null;
  }


  const method =
    order.paymentMethod ||
    order.payment?.method ||
    "BANK_TRANSFER";


  const payment =
    order.payment || {};


  const isCod =
    method ===
    "CASH_ON_DELIVERY";


  /* ===============================================
     CASH ON DELIVERY
  ================================================ */

  if (isCod) {
    return (
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


          <PaymentMethodBadge
            order={order}
          />

        </header>


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
              Collect payment on delivery.
            </h3>

            <p>
              The customer has not paid
              online. Collect the full amount
              when the order is delivered.
            </p>

          </div>

        </div>


        <div className="admin-cod-payment-total">

          <span>
            Amount due
          </span>

          <strong>
            Rs.{" "}
            {Number(
              payment.amountDue ||
              order.total ||
              0
            ).toLocaleString(
              "en-LK"
            )}
          </strong>

        </div>

      </section>
    );
  }


  /* ===============================================
     BANK TRANSFER
  ================================================ */

  return (
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


        <PaymentMethodBadge
          order={order}
        />

      </header>


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
              payment.amountPaid ||
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
            {payment.transactionReference ||
              "Not provided"}
          </strong>

        </div>


        <div>

          <span>
            Payment status
          </span>

          <strong>
            {payment.status ||
              "SUBMITTED"}
          </strong>

        </div>

      </div>


      {payment.receiptUrl ? (

        <div className="admin-payment-receipt">

          <span>
            PAYMENT RECEIPT
          </span>


          <a
            href={payment.receiptUrl}
            target="_blank"
            rel="noreferrer"
          >

            <img
              src={payment.receiptUrl}
              alt="Customer bank transfer receipt"
            />

          </a>

        </div>

      ) : (

        <div className="admin-no-payment-receipt">
          No receipt uploaded.
        </div>

      )}


      {payment.status ===
        "SUBMITTED" && (

        <div className="admin-bank-actions">

          <button
            type="button"
            className="admin-bank-reject"
            disabled={busy}
            onClick={onReject}
          >
            Reject payment
          </button>


          <button
            type="button"
            className="admin-bank-approve"
            disabled={busy}
            onClick={onApprove}
          >
            Verify payment
          </button>

        </div>

      )}

    </section>
  );
}