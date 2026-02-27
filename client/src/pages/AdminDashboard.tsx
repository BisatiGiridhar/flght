import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useSearchFlights, useCreateFlight, useDeleteFlight } from "@/hooks/use-flights";
import { useAllBookings } from "@/hooks/use-bookings";
import Navbar from "@/components/layout/Navbar";
import { Trash2, Plus, Users, Plane, Ticket } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"flights" | "bookings">("flights");

  const { data: flights, isLoading: flightsLoading } = useSearchFlights();
  const { data: bookings, isLoading: bookingsLoading } = useAllBookings();
  const { mutateAsync: createFlight } = useCreateFlight();
  const { mutateAsync: deleteFlight } = useDeleteFlight();

  useEffect(() => {
    if (!authLoading) {
      if (!user) setLocation("/login");
      else if (user.role !== "admin") setLocation("/dashboard");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || flightsLoading || bookingsLoading) {
    return <div className="min-h-screen flex items-center justify-center font-display">Loading...</div>;
  }

  const handleCreateMockFlight = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setHours(tomorrow.getHours() + 4);

    await createFlight({
      airline: "Admin Air",
      departureCity: "Test City A",
      destinationCity: "Test City B",
      departureTime: tomorrow.toISOString(),
      arrivalTime: dayAfter.toISOString(),
      duration: "4h 0m",
      price: "199.99",
      classType: "Economy",
      seatsAvailable: 60,
      isDirect: true
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" /> Admin Control Panel
            </h1>
            <p className="text-muted-foreground mt-1">Manage platform flights and user bookings.</p>
          </div>
          
          {activeTab === "flights" && (
            <button onClick={handleCreateMockFlight} className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add Mock Flight
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-8">
          <button 
            className={`pb-4 px-4 font-bold text-lg border-b-4 transition-colors flex items-center gap-2 ${activeTab === 'flights' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab("flights")}
          >
            <Plane className="w-5 h-5" /> Flights
          </button>
          <button 
            className={`pb-4 px-4 font-bold text-lg border-b-4 transition-colors flex items-center gap-2 ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab("bookings")}
          >
            <Ticket className="w-5 h-5" /> All Bookings
          </button>
        </div>

        {/* Content */}
        {activeTab === "flights" && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-secondary text-secondary-foreground text-sm uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Route</th>
                  <th className="p-4 hidden md:table-cell">Airline</th>
                  <th className="p-4 hidden sm:table-cell">Date</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {flights?.map((f) => (
                  <tr key={f.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-mono text-sm text-muted-foreground">#{f.id}</td>
                    <td className="p-4 font-bold">{f.departureCity} → {f.destinationCity}</td>
                    <td className="p-4 hidden md:table-cell">{f.airline}</td>
                    <td className="p-4 hidden sm:table-cell">{format(new Date(f.departureTime), 'MMM dd, HH:mm')}</td>
                    <td className="p-4 text-primary font-bold">${f.price}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => deleteFlight(f.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {flights?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">No flights found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-secondary text-secondary-foreground text-sm uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Ref</th>
                  <th className="p-4">User</th>
                  <th className="p-4 hidden md:table-cell">Flight Route</th>
                  <th className="p-4">Seat</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings?.map((b) => (
                  <tr key={b.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-mono text-sm text-muted-foreground">#{b.id}</td>
                    <td className="p-4 font-bold">{b.user.name} <br/><span className="font-normal text-xs text-muted-foreground">{b.user.email}</span></td>
                    <td className="p-4 hidden md:table-cell text-sm">{b.flight.departureCity} → {b.flight.destinationCity}</td>
                    <td className="p-4 font-bold text-primary">{b.seatNumber}</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">{b.paymentStatus}</span>
                    </td>
                  </tr>
                ))}
                {bookings?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}
