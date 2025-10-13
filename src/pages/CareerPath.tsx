import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Award, Briefcase, BookOpen } from 'lucide-react';

const CareerPath = () => {
  const skillGaps = [
    { skill: 'React Advanced Patterns', current: 60, target: 90 },
    { skill: 'System Design', current: 40, target: 85 },
    { skill: 'Algorithm Optimization', current: 70, target: 95 },
    { skill: 'Cloud Architecture', current: 35, target: 80 },
  ];

  const recommendations = [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Corp',
      match: 85,
      skills: ['React', 'Node.js', 'AWS'],
    },
    {
      title: 'Frontend Architect',
      company: 'Innovation Labs',
      match: 78,
      skills: ['React', 'TypeScript', 'System Design'],
    },
    {
      title: 'Tech Lead',
      company: 'StartupX',
      match: 72,
      skills: ['Leadership', 'Architecture', 'Mentoring'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Career Path</h1>
          <p className="text-muted-foreground text-lg">
            Your personalized roadmap to success
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Skill Gap Analysis */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Skill Gap Analysis</CardTitle>
              </div>
              <CardDescription>Areas to focus on for growth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {skillGaps.map((gap, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{gap.skill}</span>
                    <span className="text-muted-foreground">
                      {gap.current}% → {gap.target}%
                    </span>
                  </div>
                  <Progress value={gap.current} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Learning Recommendations */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Recommended Learning Path</CardTitle>
              </div>
              <CardDescription>Curated courses for your goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Advanced React Patterns & Performance',
                'System Design Fundamentals',
                'AWS Solutions Architect',
                'Leadership & Team Management',
              ].map((course, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{course}</p>
                    <p className="text-sm text-muted-foreground">12 weeks • Self-paced</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Job Recommendations */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Job Recommendations</CardTitle>
            </div>
            <CardDescription>Roles matching your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((job, index) => (
              <div key={index} className="p-4 rounded-lg border hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge variant={job.match >= 80 ? 'default' : 'outline'}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {job.match}% Match
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                <Button variant="outline" className="w-full">View Details</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerPath;
