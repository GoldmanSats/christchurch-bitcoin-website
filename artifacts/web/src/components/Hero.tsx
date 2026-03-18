import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";

export function Hero() {
  const scrollToMeetups = () => {
    document.getElementById("meetups")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <div className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
            <span className="text-primary text-6xl md:text-7xl font-bold relative z-10">&#8383;</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground uppercase tracking-wide leading-tight">
            Christchurch <br />
            <span className="text-primary">Bitcoin</span> <br />
            Meetup
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto mt-8 leading-relaxed">
            A monthly gathering of bitcoiners, precoiners, and anyone who is interested in sound money and freedom tech.
            Held the first Wednesday of every month at{" "}
            <a
              href="https://www.baryoku.co.nz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Bar Yoku
              <MapPin size={14} className="inline" />
            </a>
            , 20 Welles Street in the Christchurch CBD.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          <button
            onClick={scrollToMeetups}
            className="group relative px-8 py-4 bg-primary text-primary-foreground font-medium uppercase tracking-widest text-sm rounded-lg overflow-hidden transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            View Upcoming Meetups
          </button>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-muted-foreground cursor-pointer mt-8"
            onClick={scrollToMeetups}
          >
            <ChevronDown size={32} strokeWidth={1} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
