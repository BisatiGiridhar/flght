import { Link, useLocation } from "wouter";
import { Plane, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [_, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl text-white group-hover:-translate-y-1 transition-transform">
              <Plane className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              FlightFinder
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/search" className="text-muted-foreground hover:text-primary font-medium transition-colors hidden sm:block px-4">
              Explore Flights
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-foreground font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:block">Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="px-4 py-2 font-semibold text-foreground hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="btn-primary py-2.5 px-5 text-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
