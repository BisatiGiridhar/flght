import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SeatSelectionProps {
  flightId: number;
  onSelect: (seat: string) => void;
  selectedSeat: string | null;
}

export default function SeatSelection({ flightId, onSelect, selectedSeat }: SeatSelectionProps) {
  const rows = 10;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  // Mock occupied seats based on flight ID so it stays somewhat consistent
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  
  useEffect(() => {
    // Generate some deterministic random occupied seats
    const random = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    
    const generated: string[] = [];
    for (let r = 1; r <= rows; r++) {
      for (const c of cols) {
        if (random(flightId * r * c.charCodeAt(0)) > 0.7) {
          generated.push(`${r}${c}`);
        }
      }
    }
    setOccupiedSeats(generated);
  }, [flightId]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-lg">
      <h3 className="text-xl font-bold mb-6">Select your seat</h3>
      
      <div className="flex justify-center gap-6 mb-8 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md border-2 border-border bg-white"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-primary shadow-md shadow-primary/30"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-muted border border-border/50 opacity-50"></div>
          <span>Occupied</span>
        </div>
      </div>

      <div className="relative max-w-sm mx-auto bg-secondary/30 p-8 rounded-[3rem] border border-border">
        {/* Airplane Nose Mock */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-secondary/30 rounded-t-[100%] border-t border-l border-r border-border"></div>
        
        <div className="flex flex-col gap-4 relative z-10">
          {Array.from({ length: rows }).map((_, rIndex) => (
            <div key={rIndex} className="flex justify-center items-center gap-2">
              <span className="w-6 text-center text-xs font-bold text-muted-foreground mr-2">{rIndex + 1}</span>
              
              <div className="flex gap-2">
                {cols.slice(0, 3).map((col) => {
                  const seatId = `${rIndex + 1}${col}`;
                  const isOccupied = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeat === seatId;
                  
                  return (
                    <motion.button
                      whileHover={!isOccupied ? { scale: 1.1 } : {}}
                      whileTap={!isOccupied ? { scale: 0.95 } : {}}
                      key={seatId}
                      disabled={isOccupied}
                      onClick={() => onSelect(seatId)}
                      className={`
                        w-8 h-10 rounded-t-lg rounded-b-md border-2 flex items-center justify-center text-[10px] font-bold transition-colors
                        ${isOccupied ? 'bg-muted border-border/50 text-muted-foreground/30 cursor-not-allowed' : 
                          isSelected ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 
                          'bg-white border-border text-muted-foreground hover:border-primary/50'}
                      `}
                    >
                      {col}
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="w-6"></div> {/* Aisle */}
              
              <div className="flex gap-2">
                {cols.slice(3, 6).map((col) => {
                  const seatId = `${rIndex + 1}${col}`;
                  const isOccupied = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeat === seatId;
                  
                  return (
                    <motion.button
                      whileHover={!isOccupied ? { scale: 1.1 } : {}}
                      whileTap={!isOccupied ? { scale: 0.95 } : {}}
                      key={seatId}
                      disabled={isOccupied}
                      onClick={() => onSelect(seatId)}
                      className={`
                        w-8 h-10 rounded-t-lg rounded-b-md border-2 flex items-center justify-center text-[10px] font-bold transition-colors
                        ${isOccupied ? 'bg-muted border-border/50 text-muted-foreground/30 cursor-not-allowed' : 
                          isSelected ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 
                          'bg-white border-border text-muted-foreground hover:border-primary/50'}
                      `}
                    >
                      {col}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
