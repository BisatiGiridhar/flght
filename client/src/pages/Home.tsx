import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Calendar, PlaneTakeoff } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [_, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);
    setLocation(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center px-4">
          {/* landing page hero scenic plane over clouds */}
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
            alt="Airplane wing over clouds" 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10"></div>
          
          <div className="relative z-20 w-full max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-6 leading-tight drop-shadow-lg">
              Find your next <br/>
              <span className="text-primary bg-white/10 px-4 py-1 rounded-2xl backdrop-blur-sm border border-white/20 inline-block mt-2">adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 text-center mb-12 max-w-2xl mx-auto drop-shadow-md">
              Discover the world's most breathtaking destinations with our premium flight booking experience.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="glass rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto shadow-2xl">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Where from?" 
                  className="input-field pl-12 bg-white/50 focus:bg-white"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <PlaneTakeoff className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  className="input-field pl-12 bg-white/50 focus:bg-white"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input 
                  type="date" 
                  className="input-field pl-12 bg-white/50 focus:bg-white text-muted-foreground"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary md:w-auto w-full flex items-center justify-center gap-2 text-lg px-8">
                <Search className="w-5 h-5" />
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { city: "Paris", img: "https://images.unsplash.com/photo-1502602898657-3e907604b90e?q=80&w=800&auto=format&fit=crop" },
              { city: "Tokyo", img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800&auto=format&fit=crop" },
              { city: "New York", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop" }
            ].map((dest) => (
              <div key={dest.city} className="group cursor-pointer relative h-80 rounded-3xl overflow-hidden shadow-lg">
                <img src={dest.img} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{dest.city}</h3>
                  <button 
                    onClick={() => setLocation(`/search?to=${dest.city}`)} 
                    className="text-sm font-semibold bg-white/20 hover:bg-primary px-4 py-2 rounded-lg backdrop-blur-md transition-colors"
                  >
                    Explore flights
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
