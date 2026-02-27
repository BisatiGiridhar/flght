import { Plane, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Flight } from "@shared/schema";

export default function FlightCard({ flight }: { flight: Flight }) {
  // Use safe parsing for timestamps which might be strings in JSON
  const depTime = new Date(flight.departureTime);
  const arrTime = new Date(flight.arrivalTime);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Airline & Class */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg text-foreground">{flight.airline}</span>
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold uppercase tracking-wider">
              {flight.classType}
            </span>
          </div>

          <div className="flex items-center justify-between relative">
            <div className="text-center w-24">
              <p className="text-2xl font-bold font-display">{format(depTime, 'HH:mm')}</p>
              <p className="text-muted-foreground text-sm font-medium">{flight.departureCity}</p>
              <p className="text-xs text-muted-foreground mt-1">{format(depTime, 'MMM dd')}</p>
            </div>

            <div className="flex-1 flex flex-col items-center px-4 relative">
              <div className="w-full flex items-center justify-center gap-2">
                <div className="h-[2px] w-full bg-border relative"></div>
                <Plane className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="h-[2px] w-full bg-border relative"></div>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mt-2 bg-background px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                {flight.duration}
                {!flight.isDirect && <span className="ml-2 text-accent">• 1 Stop</span>}
              </div>
            </div>

            <div className="text-center w-24">
              <p className="text-2xl font-bold font-display">{format(arrTime, 'HH:mm')}</p>
              <p className="text-muted-foreground text-sm font-medium">{flight.destinationCity}</p>
              <p className="text-xs text-muted-foreground mt-1">{format(arrTime, 'MMM dd')}</p>
            </div>
          </div>
        </div>

        {/* Divider for mobile / sidebar for desktop */}
        <div className="w-full md:w-px md:h-24 bg-border"></div>

        {/* Price & Action */}
        <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto gap-4">
          <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground font-medium mb-1">Price per passenger</p>
            <p className="text-3xl font-bold text-primary font-display">${flight.price}</p>
            <p className="text-xs text-muted-foreground mt-1">{flight.seatsAvailable} seats left</p>
          </div>
          <Link href={`/checkout/${flight.id}`} className="btn-primary py-2 px-6 flex items-center gap-2 whitespace-nowrap">
            Book Flight <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
