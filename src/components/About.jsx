import { product } from "../data/siteData";


export default function About() {
  return (
    <section
      className="lux-about"
      id="about"
    >

      <div className="lux-container">


        <div className="lux-about-title">

          <span className="lux-section-label">
            OUR STORY
          </span>


          <h2>
            Rooted in
            <br />
            Sri Lankan tradition.
          </h2>

        </div>


        <div className="lux-about-layout">


          {/* IMAGE */}

          <div className="lux-about-image">

            <img
              src={
                product.collectionImageUrl ||
                "/images/hair_oil_collection.webp"
              }
              alt="Ceylon Natural Care"
              loading="lazy"
            />


            <span>
              CEYLON
              <small>
                BOTANICAL HERITAGE
              </small>
            </span>

          </div>


          {/* STORY */}

          <div className="lux-about-story">

            <span className="lux-section-label">
              OUR HERITAGE
            </span>


            <h3>
              Inspired by the
              botanical heritage
              of Ceylon.
            </h3>


            <p>
              Ceylon Natural Care brings
              traditional Sri Lankan
              botanical inspiration into
              a considered modern ritual.
            </p>


            <p>
              LACeylon Herbal Hair Oil
              combines familiar herbs and
              botanicals in a formula
              created around consistency,
              simplicity and care.
            </p>


            <a href="#ingredients">
              Discover our botanicals
              <span>
                →
              </span>
            </a>


            <div className="lux-about-stats">

              <div>
                <strong>
                  32
                </strong>

                <span>
                  HERBS
                </span>
              </div>


              <div>
                <strong>
                  {product.size}
                </strong>

                <span>
                  BOTTLE
                </span>
              </div>


              <div>
                <strong>
                  CEYLON
                </strong>

                <span>
                  ORIGIN
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}