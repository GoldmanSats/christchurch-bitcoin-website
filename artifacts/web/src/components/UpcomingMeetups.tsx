import { useState } from "react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useMeetups, useRsvp } from "@/hooks/use-meetups";
import { getListMeetupsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function UpcomingMeetups() {
  const { data: meetups, isLoading, isError } = useMeetups();
  const [selectedMeetup, setSelectedMeetup] = useState<string | null>(null);

  if (isLoading) {
    return (
      <section id="meetups" className="py-24 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-8" />
            <p className="text-muted-foreground text-sm">Loading meetups...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !meetups) {
    return null;
  }

  return (
    <section id="meetups" className="py-32 bg-background relative border-t border-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming <span className="text-primary">Meetups</span>
          </h2>
          <div className="w-16 h-0.5 bg-primary rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetups.map((meetup, index) => (
            <motion.div
              key={meetup.date}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="p-8 h-full flex flex-col items-center text-center relative z-10">
                <span className="text-muted-foreground text-xs tracking-widest uppercase mb-2">
                  {meetup.dayOfWeek}
                </span>
                
                <div className="font-bold text-5xl text-foreground my-4 font-mono">
                  {meetup.dayOfMonth}
                </div>
                
                <span className="text-lg font-light tracking-wide uppercase text-muted-foreground mb-8">
                  {meetup.month} {meetup.year}
                </span>

                <div className="mt-auto w-full space-y-5">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Users size={14} className="text-primary/70" />
                    <span>{meetup.rsvpCount} attending</span>
                  </div>

                  <button
                    onClick={() => setSelectedMeetup(meetup.date)}
                    className="w-full py-3 bg-primary/10 border border-primary/30 text-primary font-medium uppercase tracking-widest text-sm rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    RSVP
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMeetup && (
          <RsvpModal 
            meetupDate={selectedMeetup} 
            onClose={() => setSelectedMeetup(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function RsvpModal({ meetupDate, onClose }: { meetupDate: string, onClose: () => void }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const queryClient = useQueryClient();
  
  const { mutate } = useRsvp();

  const formattedDate = format(parseISO(meetupDate), "MMMM do, yyyy");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setStatus("loading");
    mutate(
      { data: { name: name.trim(), meetupDate } },
      {
        onSuccess: () => {
          setStatus("success");
          queryClient.invalidateQueries({ queryKey: getListMeetupsQueryKey() });
          setTimeout(() => onClose(), 3000);
        },
        onError: (error: unknown) => {
          const apiError = error as { status?: number; response?: { status?: number } };
          if (apiError.status === 409 || apiError.response?.status === 409) {
            setStatus("duplicate");
          } else {
            setStatus("error");
          }
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-card border border-border rounded-xl p-8 md:p-12 shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-20"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        <div className="text-center mb-8 relative z-10">
          <Calendar className="w-10 h-10 text-primary mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="font-bold text-2xl text-foreground mb-2">RSVP</h3>
          <p className="text-muted-foreground text-sm">
            {formattedDate}
          </p>
        </div>

        {status === "success" ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-8 space-y-4 relative z-10"
          >
            <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto" strokeWidth={1.5} />
            <p className="text-foreground text-lg">You're in!</p>
            <p className="text-sm text-muted-foreground">See you at the meetup.</p>
          </motion.div>
        ) : status === "duplicate" ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-8 space-y-4 relative z-10"
          >
            <AlertCircle className="w-16 h-16 text-primary mx-auto" strokeWidth={1.5} />
            <p className="text-foreground text-lg">Already registered</p>
            <p className="text-sm text-muted-foreground">This name is already on the list for this date.</p>
            <button onClick={onClose} className="mt-4 text-primary text-sm font-medium hover:underline">Close</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Name / Nym
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Satoshi"
                className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/30"
              />
            </div>
            
            {status === "error" && (
              <p className="text-destructive text-sm text-center">An error occurred. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary text-primary-foreground font-medium text-sm uppercase tracking-widest py-4 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {status === "loading" ? "Processing..." : "Confirm Attendance"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
