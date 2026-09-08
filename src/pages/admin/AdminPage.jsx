import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import "./Admin.css";


/* =========================================================
   ICONS
========================================================= */

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}


function OrdersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M5 7h14l-1 14H6L5 7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M9 7V5a3 3 0 0 1 6 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M9 12h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function PaymentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M3 9h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M7 15h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function StoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 9h16l-1-5H5L4 9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M6 9v11h12V9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M9 20v-6h6v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}


function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M10 4H5v16h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 8l4 4-4 4M9 12h9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        d="m6 8 4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/* =========================================================
   ADMIN PAGE
========================================================= */

export default function AdminPage() {
  const {
    user,
    profile,
    logout,
  } = useAuth();


  const navigate =
    useNavigate();


  const location =
    useLocation();


  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);


  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);


  /* =======================================================
     ADMIN INITIAL
  ======================================================== */

  const initial =
    profile?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    user?.email
      ?.charAt(0)
      ?.toUpperCase() ||
    "A";


  /* =======================================================
     CLOSE MENU ON ROUTE CHANGE
  ======================================================== */

  useEffect(() => {
    setMenuOpen(false);
  }, [
    location.pathname,
  ]);


  /* =======================================================
     CLOSE MENU WITH ESC
  ======================================================== */

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          event.key === "Escape"
        ) {
          setMenuOpen(false);
        }
      };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);


  /* =======================================================
     LOGOUT
  ======================================================== */

  const handleLogout =
    async () => {
      if (loggingOut) {
        return;
      }


      try {
        setLoggingOut(true);

        setMenuOpen(false);


        await logout();


        navigate(
          "/login",
          {
            replace: true,
          }
        );

      } catch (error) {
        console.error(
          "Admin logout error:",
          error
        );

      } finally {
        setLoggingOut(false);
      }
    };


  return (
    <main className="admin-page">

      <div className="admin-shell">

        {/* =================================================
            DESKTOP SIDEBAR
        ================================================== */}

        <aside className="admin-sidebar">

          {/* LOGO */}

          <NavLink
            to="/"
            className="admin-logo"
          >
            <img
              src="/images/logo.webp"
              alt="Ceylon Natural Care"
            />
          </NavLink>


          {/* ADMIN INFO */}

          <div className="admin-user">

            <div className="admin-avatar">
              {initial}
            </div>


            <div className="admin-user-info">

              <strong>
                {profile?.name ||
                  "Administrator"}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>


          {/* NAV LABEL */}

          <div className="admin-nav-label">
            ADMIN PANEL
          </div>


          {/* DESKTOP NAVIGATION */}

          <nav className="admin-nav">

            <NavLink
              to="/admin"
              end
            >

              <span className="admin-nav-icon">
                <DashboardIcon />
              </span>

              Dashboard

            </NavLink>


            <NavLink
              to="/admin/orders"
            >

              <span className="admin-nav-icon">
                <OrdersIcon />
              </span>

              Orders

            </NavLink>


            <NavLink
              to="/admin/payments"
            >

              <span className="admin-nav-icon">
                <PaymentIcon />
              </span>

              Payment Verification

            </NavLink>

          </nav>


          {/* DESKTOP FOOTER */}

          <div className="admin-sidebar-bottom">

            <NavLink to="/">

              <span className="admin-nav-icon">
                <StoreIcon />
              </span>

              View Store

            </NavLink>


            <button
              type="button"
              onClick={
                handleLogout
              }
              disabled={
                loggingOut
              }
            >

              <span className="admin-nav-icon">
                <LogoutIcon />
              </span>

              {loggingOut
                ? "Signing out..."
                : "Sign out"}

            </button>

          </div>

        </aside>


        {/* =================================================
            ADMIN CONTENT
        ================================================== */}

        <section className="admin-content">

          {/* =================================================
              MOBILE HEADER
          ================================================== */}

          <header className="admin-mobile-header">

            <NavLink
              to="/"
              className="admin-mobile-logo"
            >
              <img
                src="/images/logo.webp"
                alt="Ceylon Natural Care"
              />
            </NavLink>


            <div className="admin-mobile-title">

              <span>
                ADMIN PANEL
              </span>

              <strong>
                {profile?.name ||
                  "Administrator"}
              </strong>

            </div>


            {/* PROFILE MENU BUTTON */}

            <button
              type="button"
              className={
                menuOpen
                  ? "admin-mobile-profile active"
                  : "admin-mobile-profile"
              }
              aria-label="Open admin menu"
              aria-expanded={
                menuOpen
              }
              onClick={() => {
                setMenuOpen(
                  (current) =>
                    !current
                );
              }}
            >

              <span className="admin-mobile-avatar">
                {initial}
              </span>


              <span className="admin-mobile-chevron">
                <ChevronIcon />
              </span>

            </button>

          </header>


          {/* =================================================
              MOBILE NAVIGATION
          ================================================== */}

          <nav className="admin-mobile-nav">

            <NavLink
              to="/admin"
              end
            >

              <span className="admin-mobile-nav-icon">
                <DashboardIcon />
              </span>

              <span>
                Dashboard
              </span>

            </NavLink>


            <NavLink
              to="/admin/orders"
            >

              <span className="admin-mobile-nav-icon">
                <OrdersIcon />
              </span>

              <span>
                Orders
              </span>

            </NavLink>


            <NavLink
              to="/admin/payments"
            >

              <span className="admin-mobile-nav-icon">
                <PaymentIcon />
              </span>

              <span>
                Payments
              </span>

            </NavLink>

          </nav>


          {/* =================================================
              MOBILE DROPDOWN BACKDROP
          ================================================== */}

          {menuOpen && (
            <button
              type="button"
              className="admin-mobile-menu-backdrop"
              aria-label="Close admin menu"
              onClick={() => {
                setMenuOpen(false);
              }}
            />
          )}


          {/* =================================================
              MOBILE ADMIN DROPDOWN
          ================================================== */}

          {menuOpen && (
            <div className="admin-mobile-menu">

              {/* ADMIN */}

              <div className="admin-mobile-menu-user">

                <div className="admin-mobile-menu-avatar">
                  {initial}
                </div>


                <div>

                  <strong>
                    {profile?.name ||
                      "Administrator"}
                  </strong>

                  <span>
                    {user?.email ||
                      "Admin account"}
                  </span>

                </div>

              </div>


              {/* MENU INFO */}

              <div className="admin-mobile-menu-role">

                <span>
                  ACCOUNT ROLE
                </span>

                <strong>
                  Administrator
                </strong>

              </div>


              {/* VIEW STORE */}

              <div className="admin-mobile-menu-links">

                <NavLink
                  to="/"
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >

                  <span className="admin-mobile-menu-icon">
                    <StoreIcon />
                  </span>


                  <span className="admin-mobile-menu-text">

                    <strong>
                      View Store
                    </strong>

                    <small>
                      Open customer website
                    </small>

                  </span>

                </NavLink>

              </div>


              {/* LOGOUT */}

              <div className="admin-mobile-menu-footer">

                <button
                  type="button"
                  className="admin-mobile-menu-logout"
                  disabled={
                    loggingOut
                  }
                  onClick={
                    handleLogout
                  }
                >

                  <span className="admin-mobile-menu-icon">
                    <LogoutIcon />
                  </span>

                  <span>
                    {loggingOut
                      ? "Signing out..."
                      : "Sign out"}
                  </span>

                </button>

              </div>

            </div>
          )}


          {/* =================================================
              ADMIN CHILD PAGE
          ================================================== */}

          <Outlet />

        </section>

      </div>

    </main>
  );
}