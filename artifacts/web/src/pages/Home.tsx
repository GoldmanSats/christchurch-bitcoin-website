import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { UpcomingMeetups } from "@/components/UpcomingMeetups";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Navigation />
      <main>
        <Hero />
        <UpcomingMeetups />
      </main>
      <Footer />
    </div>
  );
}
