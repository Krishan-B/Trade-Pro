
import React from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

interface LandingPageProps {
  hero: {
    title: string;
    subtitle: string;
  };
  features: {
    title: string;
    description: string;
  }[];
  pricing: {
    plan: string;
    price: string;
    features: string[];
  }[];
}

const Landing: React.FC<LandingPageProps> = ({ hero, features, pricing }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <HeroSection title={hero.title} subtitle={hero.subtitle} />
      <FeaturesSection features={features} />
      <PricingSection plans={pricing} />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
