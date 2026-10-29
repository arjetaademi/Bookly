
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <a href="/" className="footer__logo">
            bookly<span>.</span>
          </a>
          <p>YOUR BEAUTY, YOUR MOMENT</p>
        </div>

        <div className="footer__links">
          <a
            href="https://www.instagram.com/liftbyarjeta/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>

          <a
            href="https://maps.app.goo.gl/BGgUdcLFZVQ8uceC9"
            target="_blank"
            rel="noopener noreferrer"
          >
            Location
          </a>

          <a href="mailto:arjetaademi47@gmail.com">
            Contact
          </a>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Bookly</p>

          <a
            href="https://www.linkedin.com/in/arjeta-ademi-a4a768247"
            target="_blank"
            rel="noopener noreferrer"
          >
            Designed by Arjeta Ademi
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
