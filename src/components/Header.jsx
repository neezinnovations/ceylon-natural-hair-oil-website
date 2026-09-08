import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


function UserIcon() {
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
        strokeWidth="1.5"
      />

      <path
        d="M5 21c.7-4.2 3.2-6.5 7-6.5s6.3 2.3 7 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M6 8h12l1 13H5L6 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="M9 9V6a3 3 0 0 1 6 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


export default function Header() {
  const {
    user,
    profile,
  } = useAuth();

  const cart = useCart();

  const location =
    useLocation();


  const [
    open,
    setOpen,
  ] = useState(false);


  const [
    scrolled,
    setScrolled,
  ] = useState(false);


  const items =
    cart?.items ||
    cart?.cartItems ||
    [];


  const cartCount =
    items.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );


  const accountPath =
    profile?.role === "admin"
      ? "/admin"
      : user
      ? "/account"
      : "/login";


  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    const onScroll = () => {
      setScrolled(
        window.scrollY > 15
      );
    };


    onScroll();


    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );


    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);


  useEffect(() => {
    document.body.classList.toggle(
      "lux-menu-open",
      open
    );


    return () =>
      document.body.classList.remove(
        "lux-menu-open"
      );
  }, [open]);


  return (
    <>

      {/* TOP BAR */}

      <div className="lux-topbar">

        <div className="lux-container lux-topbar-inner">

          <span>
            FREE ISLANDWIDE DELIVERY
          </span>

          <i />

          <span className="lux-topbar-secondary">
            TRADITIONAL SRI LANKAN HERBAL CARE
          </span>

        </div>

      </div>


      {/* HEADER */}

      <header
        className={
          scrolled
            ? "lux-header lux-header-scrolled"
            : "lux-header"
        }
      >

        <div className="lux-container lux-header-inner">

          {/* MOBILE MENU */}

          <button
            type="button"
            className="lux-menu-button"
            aria-label={
              open
                ? "Close menu"
                : "Open menu"
            }
            onClick={() =>
              setOpen(
                (value) =>
                  !value
              )
            }
          >
            {open
              ? <CloseIcon />
              : <MenuIcon />
            }
          </button>


          {/* LOGO */}

          <Link
            to="/"
            className="lux-logo"
          >
            <img
              src="/images/logo.webp"
              alt="Ceylon Natural Care"
            />
          </Link>


          {/* NAV */}

          <nav className="lux-nav">

            <a href="#home">
              Home
            </a>

            <a href="#product">
              Product
            </a>

            <a href="#ingredients">
              Ingredients
            </a>

            <a href="#about">
              Our Story
            </a>

            <a href="#routine">
              Routine
            </a>

            <a href="#faq">
              FAQ
            </a>

          </nav>


          {/* ACTIONS */}

          <div className="lux-header-actions">

            <a
              href="#product"
              className="lux-order-pill"
            >
              Order Now
            </a>


            <Link
              to={accountPath}
              className="lux-header-icon"
              aria-label="Account"
            >
              <UserIcon />
            </Link>


            <Link
              to="/checkout"
              className="lux-header-icon lux-bag"
              aria-label="Cart"
            >
              <BagIcon />

              {cartCount > 0 && (
                <span>
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

        </div>


        {/* MOBILE MENU */}

        <div
          className={
            open
              ? "lux-mobile-menu lux-mobile-menu-open"
              : "lux-mobile-menu"
          }
        >

          <div className="lux-container">

            <a
              href="#home"
              onClick={() =>
                setOpen(false)
              }
            >
              Home
              <span>01</span>
            </a>

            <a
              href="#product"
              onClick={() =>
                setOpen(false)
              }
            >
              Product
              <span>02</span>
            </a>

            <a
              href="#ingredients"
              onClick={() =>
                setOpen(false)
              }
            >
              Ingredients
              <span>03</span>
            </a>

            <a
              href="#about"
              onClick={() =>
                setOpen(false)
              }
            >
              Our Story
              <span>04</span>
            </a>

            <a
              href="#routine"
              onClick={() =>
                setOpen(false)
              }
            >
              Routine
              <span>05</span>
            </a>

            <a
              href="#faq"
              onClick={() =>
                setOpen(false)
              }
            >
              FAQ
              <span>06</span>
            </a>


            <Link
              to={accountPath}
              onClick={() =>
                setOpen(false)
              }
              className="lux-mobile-account"
            >
              <UserIcon />

              <strong>
                {profile?.role === "admin"
                  ? "Admin Panel"
                  : user
                  ? "My Account"
                  : "Login"}
              </strong>
            </Link>

          </div>

        </div>

      </header>


      {open && (
        <button
          type="button"
          className="lux-menu-overlay"
          aria-label="Close menu"
          onClick={() =>
            setOpen(false)
          }
        />
      )}

    </>
  );
}