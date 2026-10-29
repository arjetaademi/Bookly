
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./PriceList.css";

function PriceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchServices() {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, duration, price")
        .order("id", { ascending: true });

      if (!active) return;

      if (error) {
        setError("Could not load services.");
      } else {
        setServices(data ?? []);
      }

      setLoading(false);
    }

    fetchServices();

    return () => {
      active = false;
    };
  }, []);

  const descriptions = {
    "Lash Lift": "Naturally lifted and beautifully curled lashes.",
    "Brow Lamination": "Perfectly shaped, fuller-looking brows.",
    "Lash + Brow": "The perfect combination for lashes and brows.",
  };

  function goToBooking() {
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <section className="price-list" id="pricing">
      <div className="price-list__container">
      <p className="price-list__subtitle">OUR SERVICES</p>
<h2>Price List</h2>
<p className="price-list__description">
  Choose from our professional lash and brow services.
  <br />
  All treatments are performed with care and high-quality products.
</p>
        {loading && <p>Loading services...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && (
          <div className="price-list__cards">
            {services.map((service) => (
              <div className="price-card" key={service.id}>
                <div className="price-card__top">
                  <div>
                    <h3>{service.name}</h3>
                    <p>
                      {descriptions[service.name] ??
                        "A beautiful treatment made just for you."}
                    </p>
                  </div>

                  <span className="price-card__price">
                    {service.price.toLocaleString("en-US")} MKD
                  </span>
                </div>

                <div className="price-card__bottom">
                  <span>◷ {service.duration} min</span>

                  <button type="button" onClick={goToBooking}>
                    Book Appointment →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PriceList;
