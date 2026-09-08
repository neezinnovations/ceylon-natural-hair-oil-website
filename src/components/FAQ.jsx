import { useState } from "react";
import { product } from "../data/siteData";

const faqItems = [
  {
    id: "price",
    number: "01",
    question: "What is the price?",
    answer: `${product.name} is ${product.priceText} for a ${product.size} bottle.`,
  },

  {
    id: "delivery",
    number: "02",
    question: "Is islandwide delivery free?",
    answer:
      "Yes. We currently offer free islandwide delivery within Sri Lanka.",
  },

  {
    id: "payment",
    number: "03",
    question: "How can I make a payment?",
    answer:
      "You can complete your order through our secure checkout and follow the available payment instructions before submitting your order.",
  },

  {
    id: "order",
    number: "04",
    question: "How do I order?",
    answer:
      "Add LACeylon Herbal Hair Oil to your cart, continue to checkout, enter your delivery details and complete the payment process.",
  },

  {
    id: "everyone",
    number: "05",
    question: "Can both men and women use it?",
    answer:
      "LACeylon Herbal Hair Oil is designed as a general botanical hair-care oil and can be incorporated into different personal hair-care routines.",
  },

  {
    id: "use",
    number: "06",
    question: "How should I use it?",
    answer:
      "Apply to dry, combed hair and scalp, massage gently for around 10 minutes, leave for at least 3 hours and then wash your hair as normal.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState("price");

  function toggleFAQ(id) {
    setOpenId((current) =>
      current === id ? null : id
    );
  }

  return (
    <section
      className="lux-faq"
      id="faq"
    >
      <div className="lux-container">

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="lux-faq-heading">
          <span className="lux-section-label">
            GOOD TO KNOW
          </span>

          <h2>
            Frequently asked
            <br />
            questions.
          </h2>

          <p>
            Everything you may want to know
            before making LACeylon part of
            your hair-care ritual.
          </p>
        </div>


        {/* =================================================
            FAQ GRID
        ================================================= */}

        <div className="lux-faq-grid">

          {faqItems.map((item) => {
            const isOpen =
              openId === item.id;

            return (
              <article
                className={
                  isOpen
                    ? "lux-faq-item lux-faq-item-open"
                    : "lux-faq-item"
                }
                key={item.id}
              >
                <button
                  type="button"
                  className="lux-faq-question"
                  onClick={() =>
                    toggleFAQ(item.id)
                  }
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="lux-faq-number">
                    {item.number}
                  </span>

                  <strong>
                    {item.question}
                  </strong>

                  <span
                    className="lux-faq-toggle"
                    aria-hidden="true"
                  >
                    <i />
                    <i />
                  </span>
                </button>


                <div
                  id={`faq-answer-${item.id}`}
                  className="lux-faq-answer"
                >
                  <div>
                    <p>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}

        </div>

      </div>
    </section>
  );
}