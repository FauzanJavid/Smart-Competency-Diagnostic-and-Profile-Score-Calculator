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
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5">
                  Sign In
                </Button>
              </Link>
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
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Target className="mr-1 h-3 w-3" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive tools and AI-powered insights designed to accelerate your professional growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-card to-card/50 relative overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-gradient-hero py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Trusted by Thousands of Learners</h2>
            <p className="text-muted-foreground">Join a growing community of successful professionals</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="text-center border-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-8 pb-8">
                  <div className="stat-hero gradient-text mb-2">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-5" />
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <CardContent className="pt-16 pb-16 text-center relative z-10">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="mr-1 h-3 w-3" />
              Start Your Success Story
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
            <p className="text-muted-foreground mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who have accelerated their growth with SkillSync's 
              AI-powered assessment platform. Get personalized insights, track your progress, and 
              unlock your full potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-xl hover:shadow-2xl transition-all">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5">
                  Explore Features
                </Button>
              </Link>
            </div>
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
