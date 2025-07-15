import { useAuth } from "@/contexts/AuthContext"
import AccountMetricsHeader from "./AccountMetricsHeader"

const MainNav = () => {
  const { user } = useAuth();

  // Don't display metrics if user is not logged in
  if (!user) {
    return <div className="hidden md:flex flex-1"></div>;
  }

  return (
    <div className="hidden md:flex flex-1 items-center justify-center overflow-x-auto">
      <AccountMetricsHeader />
    </div>
  );
};

export default MainNav;
