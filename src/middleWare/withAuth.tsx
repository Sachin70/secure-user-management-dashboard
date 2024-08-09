import { Navigate } from "react-router-dom";

/**
 * HOC to protect routes by checking authentication status.
 * @param Component - The component to render if authenticated.
 */
const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
