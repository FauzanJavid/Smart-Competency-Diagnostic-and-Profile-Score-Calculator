import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Award, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Upskilling = () => {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('skills')
      .eq('user_id', user.id)
      .single();

    if (data?.skills) {
      const skills = Array.isArray(data.skills) ? (data.skills as string[]) : [];
      setUserSkills(skills);
      if (skills.length > 0) {
        loadCourseSuggestions(skills);
      }
    }
  };

  const loadCourseSuggestions = async (skills: string[]) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('course-suggestions', {
        body: { skills }
      });

      if (error) throw error;

      if (data?.courses && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        toast.error('Failed to load AI-powered course suggestions');
      }
    } catch (error) {
      console.error('Error loading course suggestions:', error);
      toast.error('Failed to load course suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSuggestions = () => {
    if (userSkills.length > 0) {
      loadCourseSuggestions(userSkills);
    } else {
      toast.error('Please add skills to your profile first');
    }
  };

  const filteredCourses = selectedDomain === 'all' 
    ? courses 
    : courses.filter(course => course.level?.toLowerCase() === selectedDomain.toLowerCase());

  const domains = [
    { value: 'all', label: 'All Courses' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Upskilling Hub</h1>
            <p className="text-muted-foreground text-lg">
              AI-powered course recommendations from top certification organizations
            </p>
          </div>
          <Button onClick={refreshSuggestions} disabled={isLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {isLoading ? 'Generating...' : 'Refresh AI Suggestions'}
          </Button>
        </div>

        {userSkills.length === 0 && (
          <Card className="border-2 border-warning mb-6">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Add skills to your profile to get personalized AI-powered course recommendations
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Finding the best courses for you...</p>
            </div>
          </div>
        ) : (
          <>
            <Tabs defaultValue="all" className="mb-6" onValueChange={setSelectedDomain}>
              <TabsList className="grid grid-cols-4 w-full max-w-2xl">
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
                  {course.provider && (
                    <p className="text-sm font-medium">{course.provider}</p>
                  )}
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
                  {course.skills?.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full group-hover:bg-gradient-primary">
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {courses.length === 0 
                ? 'Add skills to your profile to get AI-powered course recommendations'
                : 'No courses found in this category'}
            </p>
          </div>
        )}
      </>
    )}
    </div>
  );
};

export default Upskilling;
