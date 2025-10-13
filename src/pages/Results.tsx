import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  TrendingUp, 
  Clock, 
  Target,
  Download,
  Home,
  BarChart3
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Results = () => {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lastAssessmentResult');
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No assessment results found</p>
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scoreColor = result.score >= 80 ? "success" : result.score >= 60 ? "warning" : "destructive";
  const timeMinutes = Math.floor(result.timeTaken / 60);
  const timeSeconds = result.timeTaken % 60;

  const categoryData = [
    { name: "Correct", value: result.correctAnswers, color: "hsl(var(--success))" },
    { name: "Incorrect", value: result.totalQuestions - result.correctAnswers, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4 animate-pulse-glow">
            <Award className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Assessment Complete!</h1>
          <p className="text-muted-foreground text-lg">{result.assessmentTitle}</p>
        </div>

        {/* Score Card */}
        <Card className="border-2 border-primary/20 mb-8 animate-fade-in">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="stat-hero gradient-text mb-4">{result.score}%</div>
            <Progress value={result.score} className={`h-4 mb-6 max-w-md mx-auto`} />
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{result.correctAnswers}</p>
                <p className="text-sm">Correct Answers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{result.totalQuestions}</p>
                <p className="text-sm">Total Questions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">
                  {timeMinutes}:{String(timeSeconds).padStart(2, '0')}
                </p>
                <p className="text-sm">Time Taken</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Score
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.score}%</div>
              <Badge className={`mt-2 bg-${scoreColor}`}>
                {result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Accuracy
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {result.correctAnswers} of {result.totalQuestions} correct
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {timeMinutes}m {timeSeconds}s
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Avg: {Math.round(result.timeTaken / result.totalQuestions)}s per question
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Performance
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.score >= 80 ? 'A' : result.score >= 70 ? 'B' : result.score >= 60 ? 'C' : 'D'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Grade</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-2 animate-fade-in">
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Your Score', value: result.score },
                  { name: 'Average', value: 75 },
                  { name: 'Top Score', value: 95 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" className="border-2">
            <Download className="mr-2 h-4 w-4" />
            Download Certificate
          </Button>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="border-2">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground">
              Take Another Assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
