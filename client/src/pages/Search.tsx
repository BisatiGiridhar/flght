import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Filter, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FlightCard from "@/components/flights/FlightCard";
import { useSearchFlights } from "@/hooks/use-flights";

export default function Search() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  
  const [classFilter, setClassFilter] = useState("All");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFrom(params.get("from") || "");
    setTo(params.get("to") || "");
    setDate(params.get("date") || "");
  }, []);

  const { data: flights, isLoading, error } = useSearchFlights({ from, to, date });

  const filteredFlights = flights?.filter(f => classFilter === "All" || f.classType === classFilter);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm sticky top-32">
            <div className="flex items-center gap-2 font-bold text-lg mb-6 border-b border-border pb-4">
              <Filter className="w-5 h-5 text-primary" />
              Filters
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Class Type</label>
                <div className="flex flex-col gap-2">
                  {['All', 'Economy', 'Business', 'First Class'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="classType" 
                        checked={classFilter === type}
                        onChange={() => setClassFilter(type)}
                        className="w-4 h-4 text-primary bg-input border-border focus:ring-primary"
                      />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-border shadow-sm">
            <div>
              <h2 className="text-xl font-bold">
                {from && to ? `${from} to ${to}` : 'All available flights'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredFlights?.length || 0} results found {date && `for ${date}`}
              </p>
            </div>
            <button className="lg:hidden p-2 bg-secondary rounded-lg text-secondary-foreground">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-40 bg-white/50 animate-pulse rounded-2xl border border-border"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-6 rounded-2xl text-center border border-destructive/20">
              <p className="font-bold">Failed to load flights.</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          ) : filteredFlights?.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-border text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No flights found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any flights matching your criteria. Try adjusting your filters or searching for different dates.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredFlights?.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
