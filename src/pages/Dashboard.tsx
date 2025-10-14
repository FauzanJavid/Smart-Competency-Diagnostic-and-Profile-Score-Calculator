import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalAssessments: 0,
    avgScore: 0,
    timeSpent: 0,
  });

  useEffect(() => {
    loadMetrics();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('dashboard-metrics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_metrics'
        },
        () => {
          loadMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMetrics = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setMetrics({
        totalAssessments: data.total_assessments || 0,
        avgScore: data.total_assessments > 0 
          ? Math.round((data.total_score / data.total_assessments)) 
          : 0,
        timeSpent: Math.round((data.total_time_spent || 0) / 3600), // Convert to hours
      });
    }
  };

  const performanceData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 72 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: metrics.avgScore || 75 },
  ];

  const skillDistribution = [
    { name: 'Technical', value: 35, color: 'hsl(var(--chart-1))' },
    { name: 'Aptitude', value: 30, color: 'hsl(var(--chart-2))' },
    { name: 'Coding', value: 25, color: 'hsl(var(--chart-3))' },
    { name: 'Other', value: 10, color: 'hsl(var(--chart-4))' },
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-2">Assessment Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Track your progress and performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 hover:border-primary/50 transition-all animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{metrics.totalAssessments}</span>
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{metrics.avgScore}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{metrics.timeSpent}h</span>
            </div>
            <p className="text-sm text-muted-foreground">Time Spent</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Brain className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{assessmentTemplates.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 animate-fade-in">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Your score progression over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Skill Distribution</CardTitle>
            <CardDescription>Assessment categories breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
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
          {metrics.totalAssessments === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No assessments completed yet. Start your first assessment to see your activity here!
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Latest Assessment</p>
                    <p className="text-sm text-muted-foreground">View results page for details</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{metrics.avgScore}%</p>
                  <Progress value={metrics.avgScore} className="w-24 mt-1" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
