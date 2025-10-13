import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Award, ExternalLink } from 'lucide-react';

const Upskilling = () => {
  const [selectedDomain, setSelectedDomain] = useState('all');

  const courses = [
    {
      title: 'Advanced React Patterns',
      domain: 'frontend',
      level: 'Advanced',
      duration: '8 weeks',
      price: 'Free',
      skills: ['React', 'TypeScript', 'Performance'],
      url: '#',
    },
    {
      title: 'System Design Mastery',
      domain: 'backend',
      level: 'Advanced',
      duration: '12 weeks',
      price: '$99',
      skills: ['Architecture', 'Scalability', 'Databases'],
      url: '#',
    },
    {
      title: 'AWS Solutions Architect',
      domain: 'cloud',
      level: 'Intermediate',
      duration: '10 weeks',
      price: '$149',
      skills: ['AWS', 'Cloud', 'DevOps'],
      url: '#',
    },
    {
      title: 'Data Structures & Algorithms',
      domain: 'cs',
      level: 'Intermediate',
      duration: '16 weeks',
      price: 'Free',
      skills: ['Algorithms', 'Problem Solving', 'Coding'],
      url: '#',
    },
    {
      title: 'Machine Learning Fundamentals',
      domain: 'ai',
      level: 'Beginner',
      duration: '12 weeks',
      price: '$199',
      skills: ['Python', 'ML', 'Data Science'],
      url: '#',
    },
    {
      title: 'Full Stack Web Development',
      domain: 'fullstack',
      level: 'Beginner',
      duration: '20 weeks',
      price: 'Free',
      skills: ['React', 'Node.js', 'MongoDB'],
      url: '#',
    },
  ];

  const domains = [
    { value: 'all', label: 'All Courses' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'cs', label: 'CS Fundamentals' },
  ];

  const filteredCourses = selectedDomain === 'all' 
    ? courses 
    : courses.filter(course => course.domain === selectedDomain);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upskilling Hub</h1>
          <p className="text-muted-foreground text-lg">
            Curated courses to accelerate your career growth
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setSelectedDomain}>
          <TabsList className="grid grid-cols-7 w-full max-w-4xl">
            {domains.map((domain) => (
              <TabsTrigger key={domain.value} value={domain.value}>
                {domain.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <Card 
              key={index}
              className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <Badge variant={
                    course.level === 'Beginner' ? 'secondary' :
                    course.level === 'Intermediate' ? 'outline' : 'default'
                  }>
                    {course.level}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {course.price}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full group-hover:bg-gradient-primary">
                  Enroll Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No courses found in this domain. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upskilling;
