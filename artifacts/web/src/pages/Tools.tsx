import { motion } from "framer-motion";
import { Wrench, ExternalLink } from "lucide-react";
import { useResources } from "@/hooks/use-resources";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Tools() {
  const { data: resources, isLoading } = useResources();

  const tools = resources?.filter((r) => r.category === "tools");

  const grouped = tools?.reduce(
    (acc, tool) => {
      const cat = (tool as any).toolCategory || "Other";
      if (!acc[cat]) acc[cat] = { items: [] as typeof tools, note: undefined as string | undefined };
      acc[cat].items.push(tool);
      if ((tool as any).toolCategoryNote) {
        acc[cat].note = (tool as any).toolCategoryNote;
      }
      return acc;
    },
    {} as Record<string, { items: typeof tools; note?: string }>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16">
            <Wrench
              className="w-10 h-10 text-primary mb-6"
              strokeWidth={1.5}
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-primary">Tools</span>
            </h1>
            <div className="w-16 h-0.5 bg-primary rounded-full mb-6" />
            <p className="text-muted-foreground font-light leading-relaxed text-sm max-w-xl italic">
              This list is provided for educational purposes. Inclusion does not
              imply endorsement and users are encouraged to understand the
              trade-offs of any tool before using it.
            </p>
          </div>

          {isLoading && (
            <p className="text-muted-foreground text-sm">
              Loading...
            </p>
          )}

          {grouped && (
            <div className="space-y-14">
              {Object.entries(grouped).map(
                ([category, { items, note }], catIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: catIndex * 0.05 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <h2 className="text-sm font-medium text-primary uppercase tracking-widest">
                        {category}
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    {note && (
                      <p className="text-muted-foreground text-sm font-light leading-relaxed mb-6 italic">
                        {note}
                      </p>
                    )}

                    <div className="grid gap-4">
                      {items!.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block p-5 bg-card border border-border rounded-lg hover:border-primary/40 transition-all duration-300"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="text-base text-foreground font-medium mb-1.5 group-hover:text-primary transition-colors">
                                {resource.title}
                              </h3>
                              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                                {resource.description}
                              </p>
                            </div>
                            <ExternalLink
                              className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-1 transition-colors"
                              strokeWidth={1.5}
                            />
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
