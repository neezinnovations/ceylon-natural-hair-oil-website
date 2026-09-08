import {
  useEffect,
  useRef,
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

import "./Account.css";


/* =========================================================
   ICONS
========================================================= */

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M3 10.8 12 3l9 7.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5.5 9.5V21h13V9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9.5 21v-6h5v6"
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
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 8h8M8 12h8M8 16h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function AddressIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="10"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}


function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M4.5 21c.8-4.2 3.4-6.5 7.5-6.5s6.7 2.3 7.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function ShopIcon() {
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
   ACCOUNT PAGE
========================================================= */

export default function AccountPage() {
  const {
    user,
    profile,
    logout,
  } = useAuth();


  const navigate =
    useNavigate();


  const location =
    useLocation();


  const menuRef =
    useRef(null);


  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);


  /* =======================================================
     USER INITIAL
  ======================================================== */

  const initial =
    profile?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    user?.email
      ?.charAt(0)
      ?.toUpperCase() ||
    "C";


  /* =======================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ======================================================== */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [
    location.pathname,
  ]);


  /* =======================================================
     ESCAPE KEY
  ======================================================== */

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          event.key === "Escape"
        ) {
          setMobileMenuOpen(
            false
          );
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

        setMobileMenuOpen(
          false
        );


        await logout();


        navigate(
          "/login",
          {
            replace: true,
          }
        );

      } catch (error) {
        console.error(
          "Logout error:",
          error
        );

      } finally {
        setLoggingOut(false);
      }
    };


  return (
    <main className="account-page">

      <div className="account-shell">

        {/* =================================================
            DESKTOP SIDEBAR
        ================================================== */}

        <aside className="account-sidebar">

          {/* LOGO */}

          <NavLink
            to="/"
            className="account-logo"
          >
            <img
              src="/images/logo.webp"
              alt="Ceylon Natural Care"
            />
          </NavLink>


          {/* USER */}

          <div className="account-user">

            <div className="account-avatar">
              {initial}
            </div>


            <div className="account-user-info">

              <strong>
                {profile?.name ||
                  "Customer"}
              </strong>

              <span>
                Customer Account
              </span>

            </div>

          </div>


          {/* LABEL */}

          <div className="account-nav-label">
            MY ACCOUNT
          </div>


          {/* DESKTOP NAVIGATION */}

          <nav className="account-nav">

            <NavLink
              to="/account"
              end
            >
              <span className="account-nav-icon">
                <HomeIcon />
              </span>

              Dashboard
            </NavLink>


            <NavLink
              to="/account/orders"
            >
              <span className="account-nav-icon">
                <OrdersIcon />
              </span>

              My Orders
            </NavLink>


            <NavLink
              to="/account/addresses"
            >
              <span className="account-nav-icon">
                <AddressIcon />
              </span>

              Addresses
            </NavLink>


            <NavLink
              to="/account/profile"
            >
              <span className="account-nav-icon">
                <ProfileIcon />
              </span>

              Profile
            </NavLink>

          </nav>


          {/* DESKTOP BOTTOM ACTIONS */}

          <div className="account-sidebar-bottom">

            <NavLink to="/">

              <span className="account-nav-icon">
                <ShopIcon />
              </span>

              Back to Shop

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

              <span className="account-nav-icon">
                <LogoutIcon />
              </span>

              {loggingOut
                ? "Signing out..."
                : "Sign out"}

            </button>

          </div>

        </aside>


        {/* =================================================
            ACCOUNT CONTENT
        ================================================== */}

        <section className="account-content">

          {/* =================================================
              MOBILE HEADER
          ================================================== */}

          <header className="account-mobile-header">

            <NavLink
              to="/"
              className="account-mobile-logo"
            >
              <img
                src="/images/logo.webp"
                alt="Ceylon Natural Care"
              />
            </NavLink>


            <div className="account-mobile-title">

              <span>
                MY ACCOUNT
              </span>

              <strong>
                {profile?.name ||
                  "Customer"}
              </strong>

            </div>


            {/* MOBILE PROFILE MENU BUTTON */}

            <button
              type="button"
              className={
                mobileMenuOpen
                  ? "account-mobile-profile-button active"
                  : "account-mobile-profile-button"
              }
              aria-label="Open account menu"
              aria-expanded={
                mobileMenuOpen
              }
              onClick={() => {
                setMobileMenuOpen(
                  (current) =>
                    !current
                );
              }}
            >

              <span className="account-mobile-avatar">
                {initial}
              </span>

              <span className="account-mobile-chevron">
                <ChevronIcon />
              </span>

            </button>

          </header>


          {/* =================================================
              MOBILE NAVIGATION
          ================================================== */}

          <nav className="account-mobile-nav">

            <NavLink
              to="/account"
              end
            >

              <span className="account-mobile-nav-icon">
                <HomeIcon />
              </span>

              <span>
                Home
              </span>

            </NavLink>


            <NavLink
              to="/account/orders"
            >

              <span className="account-mobile-nav-icon">
                <OrdersIcon />
              </span>

              <span>
                Orders
              </span>

            </NavLink>


            <NavLink
              to="/account/addresses"
            >

              <span className="account-mobile-nav-icon">
                <AddressIcon />
              </span>

              <span>
                Address
              </span>

            </NavLink>


            <NavLink
              to="/account/profile"
            >

              <span className="account-mobile-nav-icon">
                <ProfileIcon />
              </span>

              <span>
                Profile
              </span>

            </NavLink>

          </nav>


          {/* =================================================
              MOBILE PROFILE MENU BACKDROP
          ================================================== */}

          {mobileMenuOpen && (
            <button
              type="button"
              className="account-mobile-menu-backdrop"
              aria-label="Close account menu"
              onClick={() => {
                setMobileMenuOpen(
                  false
                );
              }}
            />
          )}


          {/* =================================================
              MOBILE PROFILE DROPDOWN
          ================================================== */}

          {mobileMenuOpen && (
            <div
              ref={menuRef}
              className="account-mobile-menu"
            >

              {/* USER INFO */}

              <div className="account-mobile-menu-user">

                <div className="account-mobile-menu-avatar">
                  {initial}
                </div>


                <div>

                  <strong>
                    {profile?.name ||
                      "Customer"}
                  </strong>

                  <span>
                    {user?.email ||
                      "Customer account"}
                  </span>

                </div>

              </div>


              {/* MENU ACTIONS */}

              <div className="account-mobile-menu-links">

                <NavLink
                  to="/"
                  onClick={() => {
                    setMobileMenuOpen(
                      false
                    );
                  }}
                >

                  <span className="account-mobile-menu-icon">
                    <ShopIcon />
                  </span>


                  <span className="account-mobile-menu-text">

                    <strong>
                      Back to Shop
                    </strong>

                    <small>
                      Continue shopping
                    </small>

                  </span>

                </NavLink>


                <NavLink
                  to="/account/profile"
                  onClick={() => {
                    setMobileMenuOpen(
                      false
                    );
                  }}
                >

                  <span className="account-mobile-menu-icon">
                    <ProfileIcon />
                  </span>


                  <span className="account-mobile-menu-text">

                    <strong>
                      Account Details
                    </strong>

                    <small>
                      Manage your profile
                    </small>

                  </span>

                </NavLink>

              </div>


              {/* SIGN OUT */}

              <div className="account-mobile-menu-footer">

                <button
                  type="button"
                  className="account-mobile-menu-logout"
                  disabled={
                    loggingOut
                  }
                  onClick={
                    handleLogout
                  }
                >

                  <span className="account-mobile-menu-icon">
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
              CHILD ACCOUNT PAGE
          ================================================== */}

          <Outlet />

        </section>

      </div>

    </main>
  );
}