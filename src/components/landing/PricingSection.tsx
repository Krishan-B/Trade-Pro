import PricingCard from "./PricingCard";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const handlePricingAction = (plan: string) => {
    if (plan === "basic") {
      navigate("/auth?tab=signup&plan=basic");
    } else if (plan === "pro") {
      navigate("/auth?tab=signup&plan=pro");
    } else {
      // Enterprise plan - show contact info or navigate to contact page
      window.open("mailto:sales@tradepro.com?subject=Enterprise Plan Inquiry");
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-20 container">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          No hidden fees. Competitive rates that scale with your trading
          activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard
          title="Basic"
          price="$0"
          description="For beginners exploring the markets"
          features={[
            "Standard market access",
            "Basic charting tools",
            "Market research",
            "5 watchlists",
          ]}
          ctaText="Start Free"
          onClick={() => { handlePricingAction("basic"); }}
        />
        <PricingCard
          title="Pro"
          price="$29"
          description="For active traders seeking an edge"
          features={[
            "All Basic features",
            "Advanced charts and indicators",
            "Priority execution",
            "Unlimited watchlists",
            "API access",
          ]}
          ctaText="Upgrade to Pro"
          highlighted={true}
          onClick={() => { handlePricingAction("pro"); }}
        />
        <PricingCard
          title="Enterprise"
          price="Custom"
          description="For institutions and professional traders"
          features={[
            "All Pro features",
            "Institutional liquidity",
            "Dedicated support team",
            "Custom integrations",
            "Advanced risk management",
          ]}
          ctaText="Contact Sales"
          onClick={() => { handlePricingAction("enterprise"); }}
        />
      </div>
    </section>
  );
};

export default PricingSection;
