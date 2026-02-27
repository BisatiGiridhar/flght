import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { CreditCard, CheckCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useFlight } from "@/hooks/use-flights";
import { useCreateBooking } from "@/hooks/use-bookings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SeatSelection from "@/components/flights/SeatSelection";

export default function Checkout() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  
  const flightId = parseInt(id || "0", 10);
  const { data: flight, isLoading: flightLoading } = useFlight(flightId);
  const { mutateAsync: createBooking, isPending: isBooking } = useCreateBooking();

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || flightLoading) {
    return <div className="min-h-screen flex items-center justify-center font-display text-xl text-primary animate-pulse">Loading...</div>;
  }

  if (!flight) {
    return <div className="min-h-screen flex items-center justify-center">Flight not found.</div>;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat || !user) return;

    try {
      await createBooking({
        userId: user.id,
        flightId: flight.id,
        seatNumber: selectedSeat,
        classType: flight.classType,
        paymentStatus: "completed",
      });
      setSuccess(true);
      setTimeout(() => {
        setLocation("/dashboard");
      }, 3000);
    } catch (err) {
      alert("Failed to process booking.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-border">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-8">Your ticket has been generated. Redirecting to your dashboard...</p>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full animate-[progress_3s_ease-in-out]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 flex flex-col gap-8">
            {/* Flight Summary Summary */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-border">Flight Summary</h2>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{flight.airline}</span>
                <span className="text-sm font-semibold bg-secondary px-3 py-1 rounded-full">{flight.classType}</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                <span>{new Date(flight.departureTime).toLocaleDateString()}</span>
                <span>•</span>
                <span>{flight.departureCity} to {flight.destinationCity}</span>
              </div>
            </div>

            {/* Seat Selection */}
            <SeatSelection 
              flightId={flight.id} 
              selectedSeat={selectedSeat} 
              onSelect={setSelectedSeat} 
            />
          </div>

          {/* Payment Pane */}
          <aside className="w-full lg:w-96 shrink-0">
            <form onSubmit={handleCheckout} className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-xl sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Details
              </h3>

              <div className="bg-secondary/50 p-4 rounded-xl mb-6 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This is a secure mock payment. No real charges will be made. You can use any dummy card details.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold mb-2">Card Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="0000 0000 0000 0000" 
                    className="input-field"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-2">Expiry</label>
                    <input 
                      type="text" 
                      required
                      placeholder="MM/YY" 
                      className="input-field"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-2">CVC</label>
                    <input 
                      type="text" 
                      required
                      placeholder="123" 
                      className="input-field"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Ticket Price</span>
                  <span className="font-semibold">${flight.price}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span className="font-semibold">$45.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${(parseFloat(flight.price.toString()) + 45).toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!selectedSeat || isBooking}
                className="btn-primary w-full py-4 text-lg"
              >
                {isBooking ? "Processing..." : !selectedSeat ? "Select a seat" : "Pay & Confirm"}
              </button>
            </form>
          </aside>

        </div>
      </main>

      <Footer />
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
