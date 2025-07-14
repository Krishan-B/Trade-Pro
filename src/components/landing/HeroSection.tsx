
import React, { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, BarChart3, LineChart, TrendingUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const HeroIllustration = lazy(() => import("./HeroIllustration"));
const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-12 md:py-16 container overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <motion.div
          className="flex-1 space-y-6 md:space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Trade <span className="text-primary">Smarter</span>
            <br />
            Invest <span className="text-primary">Wiser</span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mt-4">
            Access global markets with our advanced multi-asset trading platform. Trade stocks, crypto, forex, and more with institutional-grade tools.
          </p>
          
          <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth?tab=signup")}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore Features
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Create your free account in seconds
          </p>
          
          <div className="flex items-center gap-4 text-muted-foreground pt-2">
            <span className="flex items-center gap-1 px-2 py-1 bg-secondary/40 rounded-full text-sm">
              <TrendingUp className="h-4 w-4 text-success" /> 10k+ Users
            </span>
            <span className="flex items-center gap-1 px-2 py-1 bg-secondary/40 rounded-full text-sm">
              <BarChart3 className="h-4 w-4 text-success" /> 98% Uptime
            </span>
            <span className="flex items-center gap-1 px-2 py-1 bg-secondary/40 rounded-full text-sm">
              <LineChart className="h-4 w-4 text-success" /> Real-time Data
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex-1 flex justify-center w-full mt-8 md:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Suspense fallback={<div className="w-full max-w-md h-[240px] md:h-[400px] rounded-lg bg-secondary/40 animate-pulse" />}>
            <HeroIllustration />
          </Suspense>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <ChevronDown className="h-6 w-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
