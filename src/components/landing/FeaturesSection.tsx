
import React from "react";
import FeatureCard from "./FeatureCard";
import { Shield, TrendingUp, BarChart4, Zap, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";


interface FeaturesSectionProps {
  features: {
    title: string;
    description: string;
  }[];
}

const featureIcons: { [key: string]: React.ReactNode } = {
  "Enterprise Security": <Shield className="h-6 w-6" />,
  "Real-Time Analytics": <TrendingUp className="h-6 w-6" />,
  "Multi-Asset Platform": <BarChart4 className="h-6 w-6" />,
  "Fast Execution": <Zap className="h-6 w-6" />,
  "Global Access": <Globe className="h-6 w-6" />,
  "Community Insights": <Users className="h-6 w-6" />,
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Platform Features
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            TradePro offers a comprehensive suite of tools for traders of all experience levels
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={featureIcons[feature.title] || <Shield className="h-6 w-6" />}
              title={feature.title}
              description={feature.description}
              delay={(index + 1) * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
