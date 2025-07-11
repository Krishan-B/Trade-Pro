import ApplicationLogo from "./ApplicationLogo";
import MainNav from "./MainNav";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import { Bell } from "lucide-react";
import { Button } from "../../../shared/ui/button";
import { ErrorHandler } from "../../../shared/services/errorHandling";
import { ThemeSwitcher } from "../../../features/theme/components/ThemeSwitcher";
import type { NavigationProps } from "../types";

/**
 * Main navigation component that displays the top navigation bar
 * including the logo, main navigation items, user menu, and mobile menu
 */
export function Navigation({ onMenuToggle }: NavigationProps) {
  const handleNotificationClick = () => {
    ErrorHandler.handleSuccess("Notifications", {
      description: "No new notifications at this time",
    });
  };

  return (
    <div className="border-b sticky top-0 z-50 bg-background shadow-sm transition-colors">
      <div className="container flex h-16 items-center">
        <ApplicationLogo />
        <MainNav />
        <nav className="flex items-center space-x-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationClick}
            className="mr-2"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
          <UserMenu />
          <MobileMenu onMenuToggle={onMenuToggle} />
        </nav>
      </div>
    </div>
  );
}
