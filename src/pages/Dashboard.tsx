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
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Assessment Dashboard
        </h1>
        <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Track your progress and performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in group">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-5 w-5 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {metrics.totalAssessments}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in group" style={{ animationDelay: '0.1s' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-success transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-success bg-clip-text text-transparent">
                {metrics.avgScore}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in group" style={{ animationDelay: '0.2s' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-warning transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-warning bg-clip-text text-transparent">
                {metrics.timeSpent}h
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Time Spent</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in group" style={{ animationDelay: '0.3s' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Brain className="h-5 w-5 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {assessmentTemplates.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              Performance Trend
            </CardTitle>
            <CardDescription>Your score progression over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '2px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              Skill Distribution
            </CardTitle>
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
                  animationBegin={200}
                  animationDuration={1000}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '2px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Available Assessments */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Available Assessments
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {assessmentTemplates.map((assessment, index) => (
            <Card 
              key={assessment.id}
              className="border-2 hover:border-primary/50 transition-all hover:shadow-2xl hover:-translate-y-2 group animate-fade-in overflow-hidden relative"
              style={{ animationDelay: `${0.7 + index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {assessment.title}
                    </CardTitle>
                    <CardDescription>{assessment.description}</CardDescription>
                  </div>
                  <Badge 
                    variant={assessment.difficulty === "Easy" ? "secondary" : "outline"}
                    className="ml-2 transition-transform group-hover:scale-110"
                  >
                    {assessment.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 transition-colors group-hover:text-primary">
                    <Clock className="h-4 w-4" />
                    <span>{assessment.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2 transition-colors group-hover:text-primary">
                    <Brain className="h-4 w-4" />
                    <span>{assessment.totalQuestions} questions</span>
                  </div>
                </div>
                <Link to={`/assessment/${assessment.id}`}>
                  <Button className="w-full group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-all group-hover:shadow-lg">
                    <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Start Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-2 hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </span>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
              View All <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.totalAssessments === 0 ? (
            <div className="text-center py-8 text-muted-foreground animate-fade-in">
              <Brain className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p>No assessments completed yet.</p>
              <p className="text-sm mt-1">Start your first assessment to see your activity here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <Code2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">Latest Assessment</p>
                    <p className="text-sm text-muted-foreground">View results page for details</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    {metrics.avgScore}%
                  </p>
                  <Progress value={metrics.avgScore} className="w-24 mt-1 transition-all" />
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
