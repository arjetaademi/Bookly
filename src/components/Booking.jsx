
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import emailjs from "@emailjs/browser";
import "./Booking.css";

const timeSlots = [
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

function Booking() {
  // SERVICES
  const [services, setServices] = useState([]);

  // BOOKING SELECTIONS
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);

  // CLIENT DETAILS
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");

  // STATUS
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // FETCH SERVICES
  useEffect(() => {
    let active = true;

    async function fetchServices() {
      const { data, error } = await supabase
        .from("services")
        .select("*");

      if (!active) return;

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      setServices(data ?? []);
    }

    fetchServices();

    return () => {
      active = false;
    };
  }, []);

  // FETCH BOOKED TIMES
  useEffect(() => {
    let active = true;

    setBookedTimes([]);

    if (!selectedDate) {
      return () => {
        active = false;
      };
    }

    async function fetchBookedTimes() {
      const { data, error } = await supabase.rpc(
        "get_booked_times",
        {
          selected_date: selectedDate,
        }
      );

      if (!active) return;

      if (error) {
        console.error("Error fetching booked times:", error);
        return;
      }

      const times = (data ?? []).map((booking) =>
        booking.booking_time.slice(0, 5)
      );

      setBookedTimes(times);
    }

    fetchBookedTimes();

    return () => {
      active = false;
    };
  }, [selectedDate]);

  // SAVE BOOKING
  async function handleBooking() {
    if (submitting) return;

    if (!selectedService || !selectedDate || !selectedTime) {
      setFormError("Please complete all booking steps.");
      return;
    }

    // VALIDATE EMPTY FIELDS
    if (!clientName.trim() || !phone.trim() || !email.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }

    // VALIDATE EMAIL
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    // VALIDATE PHONE
    const phonePattern = /^[0-9\s+]{7,15}$/;

    if (!phonePattern.test(phone.trim())) {
      setFormError("Please enter a valid phone number.");
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      // INSERT BOOKING INTO SUPABASE
      const { error } = await supabase
        .from("bookings")
        .insert([
          {
            client_name: clientName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            service_id: selectedService.id,
            booking_date: selectedDate,
            booking_time: selectedTime,
          },
        ]);

      if (error) {
        if (error.code === "23505") {
          setFormError(
            "This time slot has just been booked. Please choose another time."
          );
          return;
        }

        console.error("Error creating booking:", error);
        setFormError("Something went wrong. Please try again.");
        return;
      }

      // EMAIL DATA
      const emailData = {
        client_name: clientName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        service_name: selectedService.name,
        booking_date: selectedDate,
        booking_time: selectedTime,
        price: selectedService.price,
      };

      // SEND EMAILS
      // Booking remains saved even if an email fails.
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          emailData,
          {
            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          }
        );

        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID,
          emailData,
          {
            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          }
        );
      } catch (emailError) {
        console.error("Error sending emails:", emailError);
      }

      // SHOW CONFIRMATION
      setBookingConfirmed(true);
    } catch (error) {
      console.error("Unexpected booking error:", error);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="booking" id="booking">
      {bookingConfirmed ? (
        // CONFIRMATION
        <div className="booking__confirmation">
          <div className="confirmation__icon">✓</div>

          <p className="booking__subtitle">
            BOOKING CONFIRMED
          </p>

          <h2>Your appointment is booked!</h2>

          <p>
            Thank you, {clientName}. Your appointment has
            been successfully scheduled.
          </p>

          <div className="confirmation__summary">
            <h3>{selectedService?.name}</h3>
            <p>Date: {selectedDate}</p>
            <p>Time: {selectedTime}</p>
            <p>Price: {selectedService?.price} MKD</p>
          </div>
        </div>
      ) : (
        <>
          <p className="booking__subtitle">
            BOOK YOUR TIME
          </p>

          <h2>Book your appointment</h2>

          <p className="booking__description">
            Choose your service, date and preferred time.
          </p>

          {/* STEP 1 - SERVICES */}
          {step === 1 && (
            <>
              <p className="booking__step">
                STEP 1 OF 4
              </p>

              <div className="booking__services">
                {services.map((service) => (
                  <button
                    type="button"
                    key={service.id}
                    className={`service-card ${
                      selectedService?.id === service.id
                        ? "service-card--selected"
                        : ""
                    }`}
                    onClick={() => setSelectedService(service)}
                    aria-pressed={
                      selectedService?.id === service.id
                    }
                  >
                    <h3>{service.name}</h3>
                    <p>{service.duration} min</p>
                    <span>{service.price} MKD</span>
                  </button>
                ))}
              </div>

              {selectedService && (
                <div className="booking__service-actions">
                  <button
                    type="button"
                    className="booking__continue"
                    onClick={() => setStep(2)}
                  >
                    Continue →
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2 - DATE */}
          {step === 2 && (
            <div className="booking__date">
              <p className="booking__step">
                STEP 2 OF 4
              </p>

              <h3>Choose a date</h3>

              <input
                type="date"
                value={selectedDate}
                min={new Date().toLocaleDateString("en-CA")}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setSelectedTime("");
                }}
              />

              <div className="booking__actions">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>

                {selectedDate && (
                  <button
                    type="button"
                    className="booking__continue"
                    onClick={() => setStep(3)}
                  >
                    Continue →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 - TIME */}
          {step === 3 && (
            <div className="booking__time">
              <p className="booking__step">
                STEP 3 OF 4
              </p>

              <h3>Choose a time</h3>

              <div className="booking__times">
                {timeSlots.map((time) => {
                  const isBooked = bookedTimes.includes(time);

                  return (
                    <button
                      type="button"
                      key={time}
                      disabled={isBooked}
                      className={
                        selectedTime === time
                          ? "booking__time--selected"
                          : ""
                      }
                      onClick={() => setSelectedTime(time)}
                    >
                      {isBooked
                        ? `${time} - Booked`
                        : time}
                    </button>
                  );
                })}
              </div>

              <div className="booking__actions">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </button>

                {selectedTime && (
                  <button
                    type="button"
                    className="booking__continue"
                    onClick={() => setStep(4)}
                  >
                    Continue →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 - CLIENT DETAILS */}
          {step === 4 && (
            <div className="booking__details">
              <p className="booking__step">
                STEP 4 OF 4
              </p>

              <h3>Your details</h3>

              <div className="booking__form">
                <label>
                  Name
                  <input
                    type="text"
                    placeholder="Your name"
                    value={clientName}
                    onChange={(event) =>
                      setClientName(event.target.value)
                    }
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="tel"
                    placeholder="070 123 456"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </label>
              </div>

              {formError && (
                <p className="booking__error">
                  {formError}
                </p>
              )}

              <div className="booking__summary">
                <h4>Appointment Summary</h4>
                <p>{selectedService?.name}</p>
                <p>
                  {selectedDate} • {selectedTime}
                </p>
                <p>{selectedService?.price} MKD</p>
              </div>

              <div className="booking__actions">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={submitting}
                >
                  ← Back
                </button>

                <button
                  type="button"
                  className="booking__continue"
                  onClick={handleBooking}
                  disabled={submitting}
                >
                  {submitting
                    ? "Booking..."
                    : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Booking;
