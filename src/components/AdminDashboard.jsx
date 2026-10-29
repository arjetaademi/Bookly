
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  // 1. Merr rezervimet nga Supabase
  useEffect(() => {
    let active = true;

    async function fetchAppointments() {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(`
          id,
          client_name,
          phone,
          email,
          booking_date,
          booking_time,
          status,
          services(name, price, duration)
        `)
        .order("booking_date", { ascending: true })
        .order("booking_time", { ascending: true });

      if (!active) return;

      if (fetchError) {
        console.error("Error loading appointments:", fetchError);
        setError("Could not load appointments.");
        setAppointments([]);
      } else {
        setAppointments(data ?? []);
      }

      setLoading(false);
    }

    fetchAppointments();

    return () => {
      active = false;
    };
  }, []);

  // 2. Numëro rezervimet sipas statusit
  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  // 3. Dil nga llogaria admin
  async function handleLogout() {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      alert("Could not log out. Please try again.");
      return;
    }

    navigate("/admin/login", { replace: true });
  }

  // 4. Ndrysho statusin e një rezervimi
  async function handleStatusChange(bookingId, newStatus) {
    if (updatingId !== null) return;

    if (!["cancelled", "completed"].includes(newStatus)) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to mark this booking as ${newStatus}?`
    );

    if (!confirmed) return;

    setUpdatingId(bookingId);

    try {
      const { data, error: updateError } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId)
        .eq("status", "confirmed")
        .select("id, status");

      if (updateError || !data || data.length !== 1) {
        console.error("Error updating booking:", updateError);
        alert("Could not update booking status.");
        return;
      }

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === bookingId
            ? { ...appointment, status: data[0].status }
            : appointment
        )
      );
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="admin">
      {/* Dashboard header */}
      <div className="admin__header">
        <p className="admin__subtitle">BOOKLY ADMIN</p>

        <h1>Appointments Dashboard</h1>

        <p>Manage your upcoming appointments.</p>

        <button
          type="button"
          onClick={handleLogout}
          className="admin__logout"
        >
          Log Out
        </button>
      </div>

      {/* Statistics */}
      <div className="admin__stats">
        <div className="admin__card">
          <h3>Total Appointments</h3>
          <p>{appointments.length}</p>
        </div>

        <div className="admin__card">
          <h3>Confirmed</h3>
          <p>{confirmedCount}</p>
        </div>

        <div className="admin__card">
          <h3>Cancelled</h3>
          <p>{cancelledCount}</p>
        </div>

        <div className="admin__card">
          <h3>Completed</h3>
          <p>{completedCount}</p>
        </div>
      </div>

      {/* Appointments table */}
      <h2>All Appointments</h2>

      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p className="admin__error">{error}</p>
      ) : appointments.length === 0 ? (
        <p>No appointments to display.</p>
      ) : (
        <div className="admin__table-wrapper">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <strong>{appointment.client_name}</strong>
                    <br />
                    <small>{appointment.email}</small>
                    <br />
                    <small>{appointment.phone}</small>
                  </td>

                  <td>
                    {appointment.services?.name ?? "Unknown"}
                  </td>

                  <td>{appointment.booking_date}</td>

                  <td>
                    {appointment.booking_time?.slice(0, 5)}
                  </td>

                  <td>
                    {appointment.services?.price ?? 0} MKD
                  </td>

                  <td>
                    <span
                      className={`admin__status admin__status--${
                        appointment.status ?? "unknown"
                      }`}
                    >
                      {appointment.status ?? "Unknown"}
                    </span>
                  </td>

                  <td>
                    {appointment.status === "confirmed" && (
                      <div className="admin__actions">
                        <button
                          type="button"
                          className="admin__cancel"
                          disabled={updatingId !== null}
                          onClick={() =>
                            handleStatusChange(
                              appointment.id,
                              "cancelled"
                            )
                          }
                        >
                          {updatingId === appointment.id
                            ? "Saving..."
                            : "Cancel"}
                        </button>

                        <button
                          type="button"
                          className="admin__complete"
                          disabled={updatingId !== null}
                          onClick={() =>
                            handleStatusChange(
                              appointment.id,
                              "completed"
                            )
                          }
                        >
                          {updatingId === appointment.id
                            ? "Saving..."
                            : "Complete"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
