import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">FlightFinder</span>
        </div>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} FlightFinder. All rights reserved. Mock application.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground font-medium">
          <span className="hover:text-primary cursor-pointer">Terms</span>
          <span className="hover:text-primary cursor-pointer">Privacy</span>
          <span className="hover:text-primary cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
}
