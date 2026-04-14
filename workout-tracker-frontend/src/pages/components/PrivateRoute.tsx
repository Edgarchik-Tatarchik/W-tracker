import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

function PrivateRoute({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL
    fetch(`${API}/auth/me`, {
      credentials: "include",
    })
      .then((response) => {
  if (response.status === 401) {
    setIsAuthorized(false);
  } else if (response.ok) {
    setIsAuthorized(true);
  } else {
    console.error("Unexpected response:", response.status);
    setIsAuthorized(false);
  }
})
      .catch(() => {
        setIsAuthorized(false);
      });
  }, []);

  if (isAuthorized === null) {
    return <p>Loading...</p>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;