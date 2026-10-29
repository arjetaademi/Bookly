import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Booking from "./components/Booking";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import PriceList from "./components/PriceList";
import Footer from "./components/Footer";
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Hero />
            <PriceList />
            <Booking />
          <Footer />
          </>
        }
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;