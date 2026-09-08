import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="lux-footer">

      <div className="lux-container lux-footer-grid">


        <div className="lux-footer-brand">

          <img
            src="/images/logo.webp"
            alt="Ceylon Natural Care"
          />


          <p>
            Traditional botanical care,
            thoughtfully carried forward.
          </p>

        </div>


        <div>

          <strong>
            EXPLORE
          </strong>

          <a href="#product">
            Product
          </a>

          <a href="#ingredients">
            Ingredients
          </a>

          <a href="#routine">
            Routine
          </a>

        </div>


        <div>

          <strong>
            DISCOVER
          </strong>

          <a href="#about">
            Our Story
          </a>

          <a href="#faq">
            FAQ
          </a>

          <Link to="/account">
            My Account
          </Link>

        </div>


        <div>

          <strong>
            CONTACT
          </strong>

          <a href="tel:+94710683803">
            071 068 3803
          </a>


          <a
            href="https://wa.me/94710683803"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>

        </div>

      </div>


      <div className="lux-container lux-footer-bottom">

        <span>
          © {new Date().getFullYear()} Ceylon Natural Care
        </span>

        <span>
          LACeylon Herbal Hair Oil
        </span>

      </div>

    </footer>
  );
}