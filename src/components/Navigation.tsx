
import ApplicationLogo from "./navigation/ApplicationLogo"
import MainNav from "./navigation/MainNav"
import UserMenu from "./navigation/UserMenu"
import MobileMenu from "./navigation/MobileMenu"
import { Bell } from "lucide-react"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import { ThemeSwitcher } from "./theme/ThemeSwitcher"

interface NavigationProps {
  onMenuToggle?: () => void;
}

export function Navigation({ onMenuToggle }: NavigationProps) {
  const { toast } = useToast();
  
  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "No new notifications at this time",
    });
  };
  
  return (
    <div className="border-b sticky top-0 z-50 bg-background shadow-sm transition-colors">
      <div className="container flex h-16 items-center">
        <ApplicationLogo />
        <div className="hidden md:block">
          <MainNav />
        </div>
        <nav className="flex items-center space-x-2 ml-auto">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationClick}
            className="mr-2"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <div className="md:hidden">
            <MobileMenu onMenuToggle={onMenuToggle} />
          </div>
        </nav>
      </div>
    </div>
  );
}
