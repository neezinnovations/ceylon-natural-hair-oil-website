import React from "react";


function BotanicalIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        d="M37 9C23 10 15 17 14 31c10 1 19-6 23-22Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M11 39c5-11 12-18 23-25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M14 31c-4-7-8-9-11-9 0 8 4 13 11 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}


function NourishmentIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        d="M24 5s11 13 11 23a11 11 0 1 1-22 0C13 18 24 5 24 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M19 30c1 4 4 6 8 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}


function ShineIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        d="M24 6c1 10 5 14 15 15-10 1-14 5-15 15-1-10-5-14-15-15 10-1 14-5 15-15Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      <path
        d="M38 6c.5 4 2.5 6 6 6.5-3.5.5-5.5 2.5-6 6.5-.5-4-2.5-6-6-6.5 3.5-.5 5.5-2.5 6-6.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}


function OrderIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <rect
        x="11"
        y="9"
        width="26"
        height="31"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M18 9V7a6 6 0 0 1 12 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="m18 25 4 4 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


const features = [
  {
    number: "01",
    title: "Botanical Formula",
    text:
      "A thoughtfully selected blend of traditional herbs and botanicals inspired by Sri Lankan care rituals.",
    Icon: BotanicalIcon,
  },

  {
    number: "02",
    title: "Hair Nourishment",
    text:
      "Created as part of a consistent hair and scalp-care routine with a rich botanical oil blend.",
    Icon: NourishmentIcon,
  },

  {
    number: "03",
    title: "Softness & Shine",
    text:
      "A considered oil ritual designed to leave hair feeling cared for, conditioned and beautifully finished.",
    Icon: ShineIcon,
  },

  {
    number: "04",
    title: "Easy Ordering",
    text:
      "Order directly through our website with a simple checkout experience and free islandwide delivery.",
    Icon: OrderIcon,
  },
];


export default function CareFeatures() {
  return (
    <section className="lux-care-section">

      <div className="lux-container">

        {/* =================================================
            TOP EDITORIAL AREA
        ================================================= */}

        <div className="lux-care-header">

          <div className="lux-care-heading">

            <span className="lux-section-label">
              WHY LACEYLON
            </span>

            <h2>
              Simple care.
              <br />
              Thoughtfully made.
            </h2>

            <p>
              A botanical hair-care ritual built around
              traditional inspiration, considered ingredients
              and a simple routine.
            </p>

            <a href="#ingredients">
              Discover our formula

              <span>→</span>
            </a>

          </div>


          <div className="lux-care-visual">

            <div
              className="lux-care-circle lux-care-circle-one"
              aria-hidden="true"
            />

            <div
              className="lux-care-circle lux-care-circle-two"
              aria-hidden="true"
            />

            <img
              src="/images/hair_oil_benefits.webp"
              alt="LACeylon Herbal Hair Oil botanical formula"
              loading="lazy"
            />

            <span>
              BOTANICAL CARE
            </span>

          </div>

        </div>


        {/* =================================================
            FEATURES
        ================================================= */}

        <div className="lux-care-features">

          {features.map(
            ({
              number,
              title,
              text,
              Icon,
            }) => (
              <article
                className="lux-care-feature"
                key={number}
              >

                <div className="lux-care-feature-top">

                  <span>
                    {number}
                  </span>

                  <i />

                </div>


                <div className="lux-care-feature-icon">

                  <Icon />

                </div>


                <h3>
                  {title}
                </h3>


                <p>
                  {text}
                </p>

              </article>
            )
          )}

        </div>

      </div>

    </section>
  );
}