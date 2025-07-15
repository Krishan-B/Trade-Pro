
import React from "react";
import PricingCard from "./PricingCard";
import { useNavigate } from "react-router-dom";

interface Plan {
  plan: string;
  price: string;
  features: string[];
  title: string;
  description: string;
  ctaText: string;
  highlighted?: boolean;
}

interface PricingSectionProps {
  plans: {
    plan: string;
    price: string;
    features: string[];
  }[];
}

const PricingSection: React.FC<PricingSectionProps> = ({ plans }) => {
  const navigate = useNavigate();

  const handlePricingAction = (plan: string) => {
    if (plan === "basic" || plan === "pro") {
      navigate(`/auth?tab=signup&plan=${plan}`);
    } else {
      // Enterprise plan - show contact info or navigate to contact page
      window.open("mailto:sales@tradepro.com?subject=Enterprise Plan Inquiry");
    }
  };

  const planDetails: { [key: string]: Omit<Plan, 'plan' | 'price' | 'features'> } = {
    basic: {
      title: "Basic",
      description: "For beginners exploring the markets",
      ctaText: "Start Free",
    },
    pro: {
      title: "Pro",
      description: "For active traders seeking an edge",
      ctaText: "Upgrade to Pro",
      highlighted: true,
    },
    enterprise: {
      title: "Enterprise",
      description: "For institutions and professional traders",
      ctaText: "Contact Sales",
    },
  };

  return (
    <section id="pricing" className="py-16 md:py-20 container">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          No hidden fees. Competitive rates that scale with your trading activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <PricingCard
            key={plan.plan}
            title={planDetails[plan.plan]?.title || plan.plan}
            price={plan.price}
            description={planDetails[plan.plan]?.description || ""}
            features={plan.features}
            ctaText={planDetails[plan.plan]?.ctaText || "Get Started"}
            highlighted={planDetails[plan.plan]?.highlighted}
            onClick={() => handlePricingAction(plan.plan)}
          />
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
