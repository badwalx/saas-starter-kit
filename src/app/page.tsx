import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Shield,
  Rocket,
  Server,
  Code2,
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: Code2,
    title: "Next.js 14+ App Router",
    description: "Server Components, streaming, parallel routes — the latest patterns.",
  },
  {
    icon: Shield,
    title: "Supabase Auth + RLS",
    description: "Email, OAuth, magic links. Row Level Security on every table.",
  },
  {
    icon: Zap,
    title: "Stripe Billing",
    description: "Checkout, webhooks, customer portal, subscription management — done.",
  },
  {
    icon: Server,
    title: "Coolify Deployment",
    description: "Dockerfile, docker-compose, coolify.json — deploy to Hetzner in minutes.",
  },
  {
    icon: Globe,
    title: "Cloudflare DNS/CDN",
    description: "Setup script for Cloudflare with SSL, HTTP/2, and static caching.",
  },
  {
    icon: Lock,
    title: "Production Security",
    description: "Middleware auth, CSRF protection, webhook verification, env isolation.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: 29,
    period: "/mo",
    description: "For individual developers",
    features: [
      "Up to 5,000 API calls/month",
      "Full dashboard",
      "Email support",
      "Custom webhooks",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: 79,
    period: "/mo",
    description: "For growing teams",
    features: [
      "Up to 50,000 API calls/month",
      "Full dashboard + analytics",
      "Priority support",
      "Custom webhooks",
      "Team members (up to 5)",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    price: 199,
    period: "/mo",
    description: "For scaling companies",
    features: [
      "Unlimited API calls",
      "Full dashboard + analytics",
      "Dedicated support",
      "Custom webhooks",
      "Unlimited team members",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            {process.env.NEXT_PUBLIC_APP_NAME || "SaaS Kit"}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          🚀 Includes Coolify/Hetzner deployment
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
          Ship your SaaS in{" "}
          <span className="text-primary">1 hour</span>, not 1 month
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Production-ready Next.js + Supabase + Stripe boilerplate with
          Coolify deployment configs. The only starter kit that includes
          self-hosting on Hetzner.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#pricing">View Pricing</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need to ship</h2>
          <p className="text-muted-foreground text-lg">
            No more spending weeks on boilerplate. It&apos;s all here.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Coolify Differentiator */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Server className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              The ONLY boilerplate with Coolify deployment
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              ShipFast and other boilerplates only cover Vercel. We include
              Dockerfile, docker-compose.yml, coolify.json, and a complete
              Cloudflare setup script. Deploy to your own Hetzner server for
              a fraction of the cost.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-left">
              <div className="bg-background rounded-lg p-4 border">
                <CheckCircle2 className="h-5 w-5 text-green-500 mb-2" />
                <p className="font-medium">Dockerfile</p>
                <p className="text-sm text-muted-foreground">Multi-stage, standalone output</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <CheckCircle2 className="h-5 w-5 text-green-500 mb-2" />
                <p className="font-medium">Coolify Config</p>
                <p className="text-sm text-muted-foreground">Zero-downtime deploys + rollback</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <CheckCircle2 className="h-5 w-5 text-green-500 mb-2" />
                <p className="font-medium">Cloudflare Script</p>
                <p className="text-sm text-muted-foreground">DNS, SSL, HTTP/2 auto-setup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">
            Start free. Scale as you grow.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
              <CardHeader>
                {plan.popular && <Badge className="w-fit mb-2">Most Popular</Badge>}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/signup">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <Rocket className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to ship?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join hundreds of developers who skipped the boilerplate and launched in hours.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">
-             Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || "SaaS Kit"}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
