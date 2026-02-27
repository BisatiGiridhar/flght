import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Plane } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorStr, setErrorStr] = useState("");
  const { register, isRegistering } = useAuth();
  const [_, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStr("");
    try {
      await register({ name, email, password, role: "user" });
      setLocation("/dashboard");
    } catch (err: any) {
      setErrorStr(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer mb-12">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl text-white">
              <Plane className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              FlightFinder
            </span>
          </Link>
          
          <h2 className="text-3xl font-bold text-foreground mb-2">Create an account</h2>
          <p className="text-muted-foreground mb-8">Join us to start booking your next adventure.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorStr && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20">{errorStr}</div>}
            
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input 
                type="text" 
                required 
                className="input-field" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email address</label>
              <input 
                type="email" 
                required 
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input 
                type="password" 
                required 
                className="input-field" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isRegistering} className="btn-primary w-full text-lg">
              {isRegistering ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      
      {/* Visual side */}
      <div className="hidden lg:block relative w-0 flex-1">
        {/* auth page wing over ocean */}
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1980&auto=format&fit=crop"
          alt="Airplane view"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-accent/40 mix-blend-multiply"></div>
      </div>
    </div>
  );
}
