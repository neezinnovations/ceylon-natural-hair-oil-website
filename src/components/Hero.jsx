import { product } from "../data/siteData";


export default function Hero({
  onAddToCart,
}) {
  return (
    <section
      className="lux-hero"
      id="home"
    >

      <div className="lux-container lux-hero-layout">


        {/* LEFT */}

        <div className="lux-hero-copy">

          <span className="lux-section-label">
            CEYLON NATURAL CARE
          </span>


          <h1>
            Herbal
            <br />
            care

            <em>
              rooted in nature.
            </em>
          </h1>


          <p>
            A traditional Sri Lankan herbal
            hair-care ritual thoughtfully
            crafted from a botanical blend.
          </p>


          <div className="lux-hero-mini-stats">

            <span>
              32
              <small>
                BOTANICALS
              </small>
            </span>

            <span>
              {product.size}
              <small>
                SIZE
              </small>
            </span>

            <span>
              FREE
              <small>
                DELIVERY
              </small>
            </span>

          </div>

        </div>


        {/* CENTER */}

        <div className="lux-hero-product">

          <span className="lux-hero-watermark">
            LACeylon
          </span>


          <div className="lux-orbit lux-orbit-one" />

          <div className="lux-orbit lux-orbit-two" />


          <img
            src={
              product.imageUrl
            }
            alt={product.name}
            loading="eager"
          />


          <span className="lux-product-mark lux-product-mark-left">
            01
          </span>


          <span className="lux-product-mark lux-product-mark-right">
            {product.size}
          </span>

        </div>


        {/* RIGHT */}

        <div className="lux-hero-purchase">

          <span className="lux-section-label">
            SIGNATURE PRODUCT
          </span>


          <div className="lux-small-line" />


          <p>
            A traditional botanical formula
            created for a considered hair and
            scalp-care routine.
          </p>


          <div className="lux-hero-price">

            <small>
              PRICE
            </small>

            <strong>
              {product.priceText}
            </strong>

          </div>


          <div className="lux-purchase-meta">

            <div>
              <span>
                FORMULA
              </span>

              <strong>
                32 Herbs
              </strong>
            </div>


            <div>
              <span>
                VOLUME
              </span>

              <strong>
                {product.size}
              </strong>
            </div>

          </div>


          <button
            type="button"
            className="lux-hero-buy"
            onClick={onAddToCart}
          >
            <span>
              Add to Cart
            </span>

            <span>
              →
            </span>
          </button>


          <a
            href="#product"
            className="lux-discover-link"
          >
            Discover the product
          </a>

        </div>

      </div>


      <div className="lux-container lux-hero-bottom">

        <span>
          01 / SIGNATURE HAIR OIL
        </span>

        <span>
          BOTANICAL CARE FROM CEYLON
        </span>

      </div>

    </section>
  );
}