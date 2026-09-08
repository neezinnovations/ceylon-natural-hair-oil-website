import { benefits } from "../data/siteData";

export default function Benefits() {
  return (
    <section className="benefits-section">
      <div className="section-intro compact-intro">
        <span className="eyebrow">WHY AN OILING RITUAL</span>
        <h2>Simple care for the way your hair feels.</h2>
      </div>

      <div className="benefits-grid">
        {benefits.map((benefit) => (
          <article key={benefit.number}>
            <span>{benefit.number}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
