import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar__logo">Bookly</h2>

      <div className="navbar__links">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#booking" className="navbar__button">
            Book Now</a>
      </div>
    </nav>
  );
}

export default Navbar;