import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function ProtectedRoute({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      setLoading(true);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        if (active) {
          setAuthorized(false);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      if (active) {
        setAuthorized(!error && data === true);
        setLoading(false);
      }
    }

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Checking admin access...</p>;
  }

  if (!authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;