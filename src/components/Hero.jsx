
import "./Hero.css";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__container">

        <div className="hero__content">
          <p className="hero__subtitle">
            LASHES • BROWS • YOU
          </p>

          <h1>
            Beauty appointments,
            <br />
            made simple.
          </h1>

          <p className="hero__description">
            Enhance your natural beauty with professional
            lash and brow services. Easily book your
            appointment in just a few clicks.
          </p>

          <a href="#booking" className="hero__button">
            Book an Appointment
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__shape"></div>

          <div className="hero__visual-content">
            <span className="hero__sparkle">✧</span>

            <p className="hero__visual-title">
              LASH LIFT
              <br />
              BROW LAMINATION
              <br />
              NATURAL RESULTS
              <br />
              MORE CONFIDENCE
            </p>

            <div className="hero__line"></div>

            <p className="hero__visual-small">
              SAME CARE
              <br />
              MORE YOU
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
