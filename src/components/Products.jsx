import {
  useMemo,
  useState,
} from "react";

import { product } from "../data/siteData";


export default function Products({
  onAddToCart,
}) {
  const images =
    useMemo(
      () => [
        {
          src:
            product.imageUrl ||
            "/images/hair_oil_bottle.webp",
          alt:
            "LACeylon Herbal Hair Oil",
        },
        {
          src:
            product.botanicalImageUrl ||
            "/images/hair_oil_botanical_still_life.webp",
          alt:
            "LACeylon with botanicals",
        },

        {
          src:
            product.collectionImageUrl ||
            "/images/hair_oil_collection.webp",
          alt:
            "Ceylon Natural Care collection",
        },
      ],
      []
    );


  const [
    selected,
    setSelected,
  ] = useState(0);


  const [
    tab,
    setTab,
  ] = useState("about");


  return (
    <section
      className="lux-product-section"
      id="product"
    >

      <div className="lux-container lux-product-layout">


        {/* GALLERY */}

        <div className="lux-gallery">

          <div className="lux-gallery-thumbnails">

            {images.map(
              (
                image,
                index
              ) => (
                <button
                  type="button"
                  key={image.src}
                  className={
                    selected === index
                      ? "lux-thumb lux-thumb-active"
                      : "lux-thumb"
                  }
                  onClick={() =>
                    setSelected(index)
                  }
                >
                  <img
                    src={image.src}
                    alt=""
                  />
                </button>
              )
            )}

          </div>


          <div className="lux-gallery-main">

            <span className="lux-gallery-label">
              PRODUCT 01
            </span>


            <img
              key={
                images[selected].src
              }
              src={
                images[selected].src
              }
              alt={
                images[selected].alt
              }
            />


            <span className="lux-gallery-counter">
              {String(
                selected + 1
              ).padStart(
                2,
                "0"
              )}
              {" / "}
              {String(
                images.length
              ).padStart(
                2,
                "0"
              )}
            </span>

          </div>

        </div>


        {/* DETAILS */}

        <div className="lux-product-details">

          <span className="lux-section-label">
            LACeylon
          </span>


          <h2>
            LACeylon
            <br />
            Herbal Hair Oil
          </h2>


          <p className="lux-product-lead">
            A rich herbal hair oil inspired
            by traditional Sri Lankan
            botanical care.
          </p>


          <div className="lux-product-price">

            <strong>
              {product.priceText}
            </strong>

            <span>
              / {product.size}
            </span>

          </div>


          {/* TABS */}

          <div className="lux-product-tabs">

            <button
              type="button"
              className={
                tab === "about"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab("about")
              }
            >
              ABOUT
            </button>


            <button
              type="button"
              className={
                tab === "formula"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab("formula")
              }
            >
              FORMULA
            </button>


            <button
              type="button"
              className={
                tab === "use"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab("use")
              }
            >
              HOW TO USE
            </button>

          </div>


          <div className="lux-tab-content">

            {tab === "about" && (
              <p>
                A traditional botanical
                hair-care ritual developed
                around a thoughtfully selected
                blend of herbs and botanicals.
              </p>
            )}


            {tab === "formula" && (
              <div className="lux-formula-stat">

                <div>
                  <strong>
                    32
                  </strong>

                  <span>
                    BOTANICAL INGREDIENTS
                  </span>
                </div>


                <div>
                  <strong>
                    50ml
                  </strong>

                  <span>
                    SIGNATURE BOTTLE
                  </span>
                </div>

              </div>
            )}


            {tab === "use" && (
              <p>
                Apply to dry hair and scalp,
                massage gently, leave for at
                least three hours and wash
                normally.
              </p>
            )}

          </div>


          <div className="lux-product-buttons">

            <button
              type="button"
              onClick={onAddToCart}
            >
              <span>
                Add to Cart
              </span>

              <strong>
                {product.priceText}
              </strong>
            </button>


            <a href="#ingredients">
              Explore Formula
            </a>

          </div>


          <div className="lux-product-foot">

            <span>
              FREE ISLANDWIDE DELIVERY
            </span>

            <span>
              32 BOTANICAL INGREDIENTS
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}