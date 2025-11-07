import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const demoData = [
  {
    title: "Liquidity heatmap",
    description:
      "Visual-only snapshot of where the bot expects arbitrage spreads to widen during London / New York overlap.",
  },
  {
    title: "Latency lanes",
    description:
      "Fictitious measurement of execution latency across redundant AWS & GCP regions. Used for investor storytelling.",
  },
  {
    title: "Projected compounding",
    description:
      "Static Monte Carlo curve illustrating 90-day returns assuming spreads stay above 3%.",
  },
];

export function DemoVisuals() {
  return (
    <div className="flex flex-col gap-3">
      {demoData.map((item) => (
        <Card
          key={item.title}
          className="bg-gradient-to-br from-white/10 via-white/5 to-transparent"
        >
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </Card>
      ))}
    </div>
  );
}
