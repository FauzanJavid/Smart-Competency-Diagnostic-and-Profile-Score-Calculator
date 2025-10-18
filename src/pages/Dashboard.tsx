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
  ChevronRight,
  Target,
  Flame,
  Star,
  AlertCircle
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
  Legend,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
    { month: 'Jan', score: 65, assessment: 3 },
    { month: 'Feb', score: 72, assessment: 5 },
    { month: 'Mar', score: 78, assessment: 4 },
    { month: 'Apr', score: 85, assessment: 6 },
    { month: 'May', score: metrics.avgScore || 75, assessment: metrics.totalAssessments || 2 },
  ];

  const skillDistribution = [
    { name: 'Technical', value: 35 },
    { name: 'Aptitude', value: 30 },
    { name: 'Coding', value: 25 },
    { name: 'Other', value: 10 },
  ];

  const categoryPerformance = [
    { category: 'DSA', score: 85, max: 100 },
    { category: 'OS', score: 78, max: 100 },
    { category: 'DBMS', score: 82, max: 100 },
    { category: 'CN', score: 75, max: 100 },
    { category: 'Aptitude', score: 88, max: 100 },
  ];

  const radarData = [
    { subject: 'Problem Solving', score: 85, fullMark: 100 },
    { subject: 'Speed', score: 78, fullMark: 100 },
    { subject: 'Accuracy', score: 90, fullMark: 100 },
    { subject: 'Consistency', score: 82, fullMark: 100 },
    { subject: 'Complexity', score: 75, fullMark: 100 },
  ];

  const studyStreak = 7;
  const topSkills = ['Data Structures', 'Algorithms', 'Problem Solving'];
  const weakAreas = ['System Design', 'Advanced SQL'];

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

      {/* Study Streak & Performance Insights */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-warning transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Study Streak
            </CardTitle>
            <CardDescription>Keep the momentum going!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-warning to-destructive bg-clip-text text-transparent mb-2">
                {studyStreak}
              </div>
              <p className="text-sm text-muted-foreground">days in a row</p>
              <Progress value={(studyStreak / 30) * 100} className="mt-4" />
              <p className="text-xs text-muted-foreground mt-2">
                {30 - studyStreak} days until 30-day badge
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Top Skills
            </CardTitle>
            <CardDescription>Your strongest areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-success/10 border border-success/20 transition-all hover:border-success/40">
                  <Target className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Focus Areas
            </CardTitle>
            <CardDescription>Areas to improve</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weakAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20 transition-all hover:border-destructive/40">
                  <Target className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">{area}</span>
                </div>
              ))}
              <Link to="/upskilling">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Get Recommendations
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              Performance Trend
            </CardTitle>
            <CardDescription>Your score progression over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '2px solid hsl(var(--primary))',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px hsl(var(--primary) / 0.15)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#scoreGradient)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.8s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              Skill Distribution
            </CardTitle>
            <CardDescription>Assessment categories breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <defs>
                  <linearGradient id="pieGradient1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                  </linearGradient>
                  <linearGradient id="pieGradient2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-3))" />
                  </linearGradient>
                  <linearGradient id="pieGradient3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-3))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-4))" />
                  </linearGradient>
                  <linearGradient id="pieGradient4" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-4))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-5))" />
                  </linearGradient>
                </defs>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={{
                    stroke: 'hsl(var(--foreground))',
                    strokeWidth: 1
                  }}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1200}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#pieGradient${index + 1})`}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '2px solid hsl(var(--primary))',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px hsl(var(--primary) / 0.15)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.9s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              Category Performance
            </CardTitle>
            <CardDescription>Score breakdown by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryPerformance} layout="vertical">
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  dataKey="category" 
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '2px solid hsl(var(--primary))',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px hsl(var(--primary) / 0.15)'
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                />
                <Bar 
                  dataKey="score" 
                  fill="url(#barGradient)"
                  radius={[0, 8, 8, 0]}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '1.0s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              Skill Radar
            </CardTitle>
            <CardDescription>Multi-dimensional performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="subject"
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="url(#radarGradient)"
                  fillOpacity={0.6}
                  strokeWidth={2}
                  animationDuration={1200}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '2px solid hsl(var(--primary))',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px hsl(var(--primary) / 0.15)'
                  }}
                />
              </RadarChart>
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
