import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { useResources } from "@/hooks/use-resources";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const EDUCATION_CATEGORIES = ["getting-started", "education", "news"];

export default function Education() {
  const { data: resources, isLoading } = useResources();

  const filtered = resources?.filter((r) =>
    EDUCATION_CATEGORIES.includes(r.category)
  );

  const groupedResources = filtered?.reduce(
    (acc, resource) => {
      if (!acc[resource.category]) acc[resource.category] = [];
      acc[resource.category].push(resource);
      return acc;
    },
    {} as Record<string, typeof filtered>
  );

  const formatCategory = (str: string) => {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16">
            <BookOpen
              className="w-10 h-10 text-primary mb-6"
              strokeWidth={1.5}
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-primary">Resources</span>
            </h1>
            <div className="w-16 h-0.5 bg-primary rounded-full mb-6" />
            <p className="text-muted-foreground font-light leading-relaxed text-sm max-w-xl">
              A curated selection of materials to expand your understanding of
              Bitcoin, from foundational texts to practical guides.
            </p>
          </div>

          {isLoading && (
            <p className="text-muted-foreground text-sm">
              Loading...
            </p>
          )}

          {groupedResources && (
            <div className="space-y-14">
              {Object.entries(groupedResources).map(
                ([category, items], catIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-sm font-medium text-primary uppercase tracking-widest">
                        {formatCategory(category)}
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                    </div>

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
