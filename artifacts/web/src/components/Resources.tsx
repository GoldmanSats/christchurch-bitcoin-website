import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { useResources } from "@/hooks/use-resources";

export function Resources() {
  const { data: resources, isLoading } = useResources();

  if (isLoading || !resources) return null;

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) acc[resource.category] = [];
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  const formatCategory = (str: string) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <section id="resources" className="py-32 bg-card relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-0 scanline-overlay" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-16">
          
          <div className="md:w-1/3">
            <div className="sticky top-32">
              <BookOpen className="w-10 h-10 text-primary mb-6" strokeWidth={1.5} />
              <h2 className="text-4xl font-bold text-foreground uppercase tracking-wider mb-6 leading-tight">
                The <span className="text-primary text-glow italic">Library</span>
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed text-sm">
                A curated selection of materials to expand your understanding of Bitcoin, 
                from foundational texts to practical tools.
              </p>
            </div>
          </div>

          <div className="md:w-2/3 space-y-14">
            {Object.entries(groupedResources).map(([category, items], catIndex) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-sm font-mono text-primary uppercase tracking-[0.2em]">
                    <span className="text-primary/40">// </span>{formatCategory(category)}
                  </h3>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <div className="grid gap-4">
                  {items.map((resource) => (
                    <a 
                      key={resource.id} 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-5 bg-background border border-border hover:border-primary/40 hover:shadow-[0_0_12px_hsl(175,85%,50%,0.08)] transition-all duration-300"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-base text-foreground font-medium mb-1.5 group-hover:text-primary transition-colors font-mono">
                            {resource.title}
                          </h4>
                          <p className="text-muted-foreground text-sm font-light leading-relaxed">
                            {resource.description}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-1 transition-colors" strokeWidth={1.5} />
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
