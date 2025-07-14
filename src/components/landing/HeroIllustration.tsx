import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const HeroIllustration = () => {
  return (
    <div className="relative w-full max-w-md h-[240px] md:h-[400px] rounded-lg overflow-hidden glass-effect">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/0"></div>
      <img 
        src="/trading-dashboard.svg" 
        alt="Trading Dashboard" 
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/600x400/141413/8989DE?text=Trading+Dashboard';
        }}
      />
      
      <motion.div 
        className="absolute top-4 right-4 bg-card p-3 rounded-lg shadow-lg max-w-[180px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <div className="text-xs text-muted-foreground mb-1">Total Sales</div>
        <div className="text-xl font-bold mb-1">$89,000</div>
        <div className="flex items-center text-xs text-success">
          <TrendingUp className="h-3 w-3 mr-1" /> 8.5% Up from yesterday
        </div>
      </motion.div>
    </div>
  );
};

export default HeroIllustration;