const steps = [
  {
    number: "01",
    title: "Apply",
    text:
      "Apply to dry, combed hair and directly onto the scalp.",
    image:
      "/images/apply.svg",
  },

  {
    number: "02",
    title: "Massage",
    text:
      "Massage gently into your scalp for around ten minutes.",
    image:
      "/images/massage.svg",
  },

  {
    number: "03",
    title: "Leave",
    text:
      "Allow the oil to remain for at least three hours.",
    image:
      "/images/leave.svg",
  },

  {
    number: "04",
    title: "Wash",
    text:
      "Wash your hair normally and repeat consistently.",
    image:
      "/images/wash.svg",
  },
];


export default function Routine() {
  return (
    <section
      className="lux-routine"
      id="routine"
    >

      <div className="lux-container">


        {/* HEADING */}

        <div className="lux-routine-heading">

          <div>

            <span className="lux-section-label">
              THE RITUAL
            </span>


            <h2>
              Four steps.
              <br />
              One routine.
            </h2>

          </div>


          <p>
            A simple way to make
            LACeylon part of a calm,
            considered hair-care ritual.
          </p>

        </div>


        {/* LINE */}

        <div className="lux-routine-line">

          {steps.map(
            (step) => (
              <span
                key={
                  step.number
                }
              >
                <i />

                {step.number}
              </span>
            )
          )}

        </div>


        {/* STEPS */}

        <div className="lux-routine-grid">

          {steps.map(
            (step) => (
              <article
                key={
                  step.number
                }
              >

                <div className="lux-routine-icon">

                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                  />

                </div>


                <h3>
                  {step.title}
                </h3>


                <p>
                  {step.text}
                </p>

              </article>
            )
          )}

        </div>

      </div>

    </section>
  );
}