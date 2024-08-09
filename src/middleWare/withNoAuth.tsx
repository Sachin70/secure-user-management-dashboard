import { Navigate } from "react-router-dom";

/**
 * HOC to protect routes by redirecting authenticated users away from login/signup pages.
 * @param Component - The component to render if not authenticated.
 */
const withNoAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const token = localStorage.getItem("token");

    if (token) {
      return <Navigate to="/dashboard" />;
    }

    return <Component {...props} />;
  };
};

export default withNoAuth;
