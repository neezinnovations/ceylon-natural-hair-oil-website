import { useState } from "react";


const ingredients = [
  {
    number: "01",
    sinhala: "නෙල්ලි",
    english: "Nelli",
    botanical: "Amla",
    description:
      "A familiar botanical traditionally included in Sri Lankan and South Asian hair-care rituals.",
  },

  {
    number: "02",
    sinhala: "සපත්තු මල්",
    english: "Hibiscus",
    botanical: "Hibiscus",
    description:
      "A floral botanical selected as part of LACeylon's traditional herbal hair-care blend.",
  },

  {
    number: "03",
    sinhala: "කරපිංචා",
    english: "Curry Leaves",
    botanical: "Curry Leaf",
    description:
      "A familiar Sri Lankan botanical featured within the traditional LACeylon formula.",
  },

  {
    number: "04",
    sinhala: "පෙර දලු",
    english: "Guava Leaves",
    botanical: "Guava",
    description:
      "Young guava leaves form part of the carefully selected botanical collection behind LACeylon.",
  },

  {
    number: "05",
    sinhala: "කොහොඹ",
    english: "Neem",
    botanical: "Neem",
    description:
      "A recognised botanical included among the traditional herbs used in the LACeylon blend.",
  },

  {
    number: "06",
    sinhala: "කරාබුනැටි",
    english: "Clove",
    botanical: "Clove",
    description:
      "An aromatic botanical selected as one of the ingredients within the traditional herbal formula.",
  },
];


export default function IngredientExperience() {
  const [selected, setSelected] =
    useState(3);


  const current =
    ingredients[selected];


  return (
    <section
      className="lux-ingredients"
      id="ingredients"
    >
      <div className="lux-container">

        {/* ================================================
            HEADER
        ================================================= */}

        <div className="lux-ingredients-heading">

          <div>
            <span className="lux-gold-label">
              OUR BOTANICALS
            </span>

            <h2>
              Nature inside
              <br />
              every drop.
            </h2>
          </div>


          <div className="lux-ingredients-heading-copy">

            <span>
              06 SIGNATURE BOTANICALS
            </span>

            <p>
              Discover a curated selection
              from the complete LACeylon
              32-herb botanical formula.
            </p>

          </div>

        </div>


        {/* ================================================
            MAIN GRID
        ================================================= */}

        <div className="lux-ingredients-layout">

          {/* LEFT LIST */}

          <div className="lux-ingredient-list">

            <div className="lux-ingredient-list-label">
              <span>
                FEATURED BOTANICALS
              </span>

              <span>
                06 / 32
              </span>
            </div>


            {ingredients.map(
              (ingredient, index) => (
                <button
                  type="button"
                  key={ingredient.english}
                  className={
                    selected === index
                      ? "lux-ingredient lux-ingredient-active"
                      : "lux-ingredient"
                  }
                  onClick={() =>
                    setSelected(index)
                  }
                >

                  <span className="lux-ingredient-number">
                    {ingredient.number}
                  </span>


                  <div className="lux-ingredient-name">

                    <strong>
                      {ingredient.sinhala}
                    </strong>

                    <small>
                      {ingredient.english}
                    </small>

                  </div>


                  <span className="lux-ingredient-arrow">
                    →
                  </span>

                </button>
              )
            )}


            <div className="lux-ingredient-list-footer">

              <span>
                +26
              </span>

              <p>
                Additional herbs complete
                the full botanical formula.
              </p>

            </div>

          </div>


          {/* ================================================
              CENTER ART
          ================================================= */}

          <div className="lux-botanical-scene">

            <span className="lux-botanical-watermark">
              CEYLON
            </span>

            <img
              src="/images/hair_oil_bottle_ingredient.webp"
              alt="LACeylon botanical formula"
              loading="lazy"
            
            />

            <div className="lux-botanical-caption">
              <span>
                BOTANICAL FORMULA
              </span>
              <strong>
                32 HERBS
              </strong>
            </div>
          </div>


          {/* ================================================
              SELECTED BOTANICAL
          ================================================= */}

          <div className="lux-selected-ingredient">

            <span className="lux-selected-index">
              {current.number}
            </span>


            <div className="lux-selected-rule" />


            <span className="lux-selected-label">
              SIGNATURE BOTANICAL
            </span>


            <h3>
              {current.english}
            </h3>


            <strong className="lux-selected-sinhala">
              {current.sinhala}
            </strong>


            <p>
              {current.description}
            </p>


            <div className="lux-selected-details">

              <div>
                <span>
                  TYPE
                </span>

                <strong>
                  BOTANICAL
                </strong>
              </div>


              <div>
                <span>
                  FORMULA
                </span>

                <strong>
                  32 HERBS
                </strong>
              </div>

            </div>


            <div className="lux-selected-bottom">

              <span>
                {String(
                  selected + 1
                ).padStart(2, "0")}
              </span>

              <div>
                <i />

                <i
                  style={{
                    width:
                      `${
                        ((selected + 1) /
                          ingredients.length) *
                        100
                      }%`,
                  }}
                />
              </div>

              <span>
                06
              </span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}