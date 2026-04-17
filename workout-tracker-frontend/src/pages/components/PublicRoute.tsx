import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { apiFetch } from "../../lib/api";

function PublicRoute({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    apiFetch("/auth/me")
      .then(() => setIsAuthorized(true))
      .catch(() => setIsAuthorized(false));
  }, []);

  if (isAuthorized === null) {
    return <p>Loading...</p>;
  }

  if (isAuthorized) {
    return <Navigate to="/workouts" replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
