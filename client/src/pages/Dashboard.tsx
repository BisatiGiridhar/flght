import { useEffect } from "react";
import { useLocation } from "wouter";
import { Ticket, Download, Plane } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUserBookings } from "@/hooks/use-bookings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [_, setLocation] = useLocation();
  const { data: bookings, isLoading: bookingsLoading } = useUserBookings(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || bookingsLoading) {
    return <div className="min-h-screen flex items-center justify-center font-display text-xl">Loading...</div>;
  }

  const handleDownload = (bookingId: number) => {
    alert(`Downloading E-Ticket for Booking #${bookingId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold font-display mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your bookings and download e-tickets.</p>
        </div>

        {bookings?.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-border text-center shadow-sm">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6">You haven't booked any flights. Time for an adventure!</p>
            <button onClick={() => setLocation("/search")} className="btn-primary">
              Explore Flights
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings?.map((booking) => {
              const flight = booking.flight;
              const depTime = new Date(flight.departureTime);
              return (
                <div key={booking.id} className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                  
                  {/* Decorative element */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Plane className="w-5 h-5 text-primary" />
                        <span className="font-bold text-lg">{flight.airline}</span>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Confirmed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">From</p>
                        <p className="font-bold text-lg">{flight.departureCity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">To</p>
                        <p className="font-bold text-lg">{flight.destinationCity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                        <p className="font-bold">{format(depTime, 'MMM dd, HH:mm')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Seat & Class</p>
                        <p className="font-bold text-primary">{booking.seatNumber} • <span className="text-foreground">{booking.classType}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0 flex flex-col gap-3">
                    <button 
                      onClick={() => handleDownload(booking.id)}
                      className="btn-secondary flex items-center justify-center gap-2 px-6"
                    >
                      <Download className="w-4 h-4" /> E-Ticket
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
