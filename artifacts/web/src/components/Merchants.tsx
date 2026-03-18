import { motion } from "framer-motion";
import { Store, MapPin, Globe } from "lucide-react";
import { useMerchants } from "@/hooks/use-merchants";

export function Merchants() {
  const { data: merchants, isLoading } = useMerchants();

  if (isLoading || !merchants || merchants.length === 0) return null;

  return (
    <section id="merchants" className="py-32 bg-background relative border-t border-primary/10">
      <div className="absolute inset-0 cyber-grid-overlay opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <Store className="w-10 h-10 text-primary mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-wider mb-4">
            Local <span className="text-primary text-glow">Merchants</span>
          </h2>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto mt-6 text-sm">
            Support the circular economy. These Ōtautahi businesses accept Bitcoin for goods and services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant, i) => (
            <motion.div
              key={merchant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card neon-border neon-border-hover p-7 transition-all duration-500 flex flex-col h-full group"
            >
              <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest mb-5 w-max">
                {merchant.category}
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">{merchant.name}</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8 flex-grow">
                {merchant.description}
              </p>

              <div className="space-y-3 mt-auto pt-5 border-t border-border/50">
                {merchant.address && (
                  <div className="flex items-start gap-3 text-sm text-foreground/70 font-mono">
                    <MapPin className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span className="text-xs">{merchant.address}</span>
                  </div>
                )}
                {merchant.website && (
                  <div className="flex items-center gap-3 text-sm text-foreground/70 font-mono">
                    <Globe className="w-4 h-4 text-primary/60 shrink-0" strokeWidth={1.5} />
                    <a href={merchant.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:text-primary transition-colors">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
