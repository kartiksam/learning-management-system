import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDefaultRouteForRole } from "../../utils/auth";
const OAuthSuccess = () => {
  const navigate = useNavigate();
  // We expect the backend to redirect to this page with a URL like:
  // http://localhost:3000/oauth-success?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  and the token
  //   param will contain the JWT we need to store for authenticationis retrieve url
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const target = getDefaultRouteForRole();
      navigate(target);
      // navigate("/list");
    }
  }, []);

  return <h2>Logging in...</h2>;
};

export default OAuthSuccess;
