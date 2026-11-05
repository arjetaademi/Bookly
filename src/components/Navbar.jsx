import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar__logo">
         <svg
          className="navbar__icon"
          viewBox="0 0 80 40"
          width="52"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 12 Q40 30 76 12" strokeWidth="3.5" />
          <g strokeWidth="2.2">
            <path d="M7.6 13.7 Q4 17 1 22" />
            <path d="M14.8 16.6 Q12 21 10 28" />
            <path d="M22.7 18.9 Q20.5 24 19 31" />
            <path d="M30.6 20.4 Q30 26 29 33" />
            <path d="M40 21 Q40 27 40 34" />
            <path d="M49.4 20.4 Q50 26 51 33" />
            <path d="M57.3 18.9 Q59.5 24 61 31" />
            <path d="M65.2 16.6 Q68 21 70 28" />
            <path d="M72.4 13.7 Q76 17 79 22" />
          </g>
        </svg>
        Bookly</h2>

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