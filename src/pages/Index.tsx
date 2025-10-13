import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Brain, 
  Code, 
  Target, 
  TrendingUp, 
  Award, 
  Shield,
  Clock,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center animate-slide-up">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Assessment Platform
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight lg:text-7xl mb-6">
              Master Your{" "}
              <span className="gradient-text">Career Journey</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comprehensive AI-driven assessments, real-time proctoring, and personalized 
              career guidance to accelerate your professional growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-lg animate-pulse-glow">
                  Start Assessment
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2">
                View Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </section>

      {/* Features Grid */}
      <section className="container py-24">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive tools and AI-powered insights for your assessment journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-hero py-24">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-hero gradient-text mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-5" />
          <CardContent className="pt-12 pb-12 text-center relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their growth with our 
              AI-powered assessment platform.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-xl">
                Get Started Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

const features = [
  {
    icon: Brain,
    title: "AI-Powered Grading",
    description: "Advanced AI algorithms evaluate your responses with precision and provide detailed feedback.",
  },
  {
    icon: Code,
    title: "Live Coding Environment",
    description: "Real-time code execution with Monaco editor supporting multiple programming languages.",
  },
  {
    icon: Shield,
    title: "Smart Proctoring",
    description: "Browser monitoring and behavior analysis ensure assessment integrity.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description: "Identify strengths and weaknesses with detailed performance heatmaps.",
  },
  {
    icon: TrendingUp,
    title: "Career Guidance",
    description: "Personalized learning paths and job recommendations based on your results.",
  },
  {
    icon: Award,
    title: "Instant Certificates",
    description: "Download verified certificates immediately upon assessment completion.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Take assessments at your own pace with intelligent time management.",
  },
  {
    icon: CheckCircle2,
    title: "Real-time Analytics",
    description: "Track your progress with comprehensive dashboards and insights.",
  },
];

const stats = [
  { value: "50K+", label: "Assessments Completed" },
  { value: "95%", label: "Success Rate" },
  { value: "200+", label: "Question Bank" },
  { value: "24/7", label: "Available" },
];

export default Index;
