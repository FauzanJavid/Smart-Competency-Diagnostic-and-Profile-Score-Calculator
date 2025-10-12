import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Code2, 
  Brain, 
  Clock, 
  TrendingUp,
  Award,
  Play,
  ChevronRight
} from "lucide-react";
import { assessmentTemplates } from "@/lib/assessments";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2">Assessment Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Choose an assessment to begin your journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Assessments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Assessments</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {assessmentTemplates.map((assessment, index) => (
              <Card 
                key={assessment.id}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{assessment.title}</CardTitle>
                      <CardDescription>{assessment.description}</CardDescription>
                    </div>
                    <Badge 
                      variant={assessment.difficulty === "Easy" ? "secondary" : "outline"}
                      className="ml-2"
                    >
                      {assessment.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{assessment.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>{assessment.totalQuestions} questions</span>
                    </div>
                  </div>
                  <Link to={`/assessment/${assessment.id}`}>
                    <Button className="w-full group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                      <Play className="mr-2 h-4 w-4" />
                      Start Assessment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-2 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-${activity.color}/10 flex items-center justify-center`}>
                      <activity.icon className={`h-5 w-5 text-${activity.color}`} />
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{activity.score}%</p>
                    <Progress value={activity.score} className="w-24 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const quickStats = [
  { icon: Award, value: "0", label: "Completed" },
  { icon: TrendingUp, value: "0%", label: "Avg Score" },
  { icon: Clock, value: "0h", label: "Time Spent" },
  { icon: Brain, value: "4", label: "Available" },
];

const recentActivity = [
  {
    icon: Code2,
    title: "Technical Assessment",
    date: "Example - Not taken yet",
    score: 85,
    color: "primary",
  },
  {
    icon: Brain,
    title: "Aptitude Test",
    date: "Example - Not taken yet",
    score: 92,
    color: "success",
  },
];

export default Dashboard;
