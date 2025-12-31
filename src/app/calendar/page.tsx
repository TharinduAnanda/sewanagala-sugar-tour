'use client'

import GoogleCalendarDisplay from "@/components/GoogleCalendarDisplay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CalendarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <GoogleCalendarDisplay />
      </main>
      <Footer />
    </div>
  );
}
