import {
  useEffect,
  useState,
} from "react";

import { product } from "../data/siteData";
import { useCart } from "../context/CartContext";


export default function StickyBuyBar({
  onAddToCart,
}) {
  const cart =
    useCart();


  const [
    visible,
    setVisible,
  ] = useState(false);


  const items =
    cart?.items ||
    cart?.cartItems ||
    [];


  const item =
    items.find(
      (value) =>
        value.productId ===
        product.productId
    );


  const quantity =
    item?.quantity || 0;


  useEffect(() => {
    const update = () => {
      const hero =
        document.querySelector(
          ".lux-hero"
        );


      if (!hero) {
        setVisible(false);
        return;
      }


      const rect =
        hero.getBoundingClientRect();


      setVisible(
        rect.bottom < 300
      );
    };


    update();


    window.addEventListener(
      "scroll",
      update,
      {
        passive: true,
      }
    );


    return () =>
      window.removeEventListener(
        "scroll",
        update
      );
  }, []);


  return (
    <div
      className={
        visible
          ? "lux-sticky lux-sticky-visible"
          : "lux-sticky"
      }
    >

      <div>

        <small>
          LACeylon Herbal Hair Oil
        </small>

        <strong>
          {product.priceText}
          {" · "}
          {product.size}
        </strong>

      </div>


      <button
        type="button"
        onClick={onAddToCart}
      >
        <span>
          Add to Cart

          {quantity > 0 &&
            ` (${quantity})`}
        </span>

        <span>
          →
        </span>
      </button>

    </div>
  );
}