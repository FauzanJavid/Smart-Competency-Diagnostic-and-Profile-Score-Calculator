import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Award, Briefcase, BookOpen, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CareerPath = () => {
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [jobSuggestions, setJobSuggestions] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        loadCareerSuggestions(skills);
      }
    }
  };

  const loadCareerSuggestions = async (skills: string[]) => {
    setIsLoading(true);
    try {
      const [jobsResponse, trendsResponse, roadmapResponse] = await Promise.all([
        supabase.functions.invoke('career-suggestions', { body: { skills, type: 'jobs' } }),
        supabase.functions.invoke('career-suggestions', { body: { skills, type: 'trends' } }),
        supabase.functions.invoke('career-suggestions', { body: { skills, type: 'roadmap' } })
      ]);

      if (jobsResponse.data?.data) {
        setJobSuggestions(Array.isArray(jobsResponse.data.data) ? jobsResponse.data.data : []);
      }
      if (trendsResponse.data?.data) {
        setTrends(Array.isArray(trendsResponse.data.data) ? trendsResponse.data.data : []);
      }
      if (roadmapResponse.data?.data) {
        setRoadmap(Array.isArray(roadmapResponse.data.data) ? roadmapResponse.data.data : []);
      }
    } catch (error) {
      console.error('Error loading career suggestions:', error);
      toast.error('Failed to load AI-powered suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSuggestions = () => {
    if (userSkills.length > 0) {
      loadCareerSuggestions(userSkills);
    } else {
      toast.error('Please add skills to your profile first');
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Career Path</h1>
          <p className="text-muted-foreground text-lg">
            AI-powered career guidance based on your skills
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
              Add skills to your profile to get personalized AI-powered career recommendations
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Generating AI-powered suggestions...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Tech Trends */}
          {trends.length > 0 && (
            <Card className="border-2 mb-6 animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Current Tech Trends 2025</CardTitle>
                </div>
                <CardDescription>AI-powered insights on industry trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trends.map((trend: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg border hover:border-primary/50 transition-all">
                    <h3 className="font-semibold text-lg mb-2">{trend.name}</h3>
                    <p className="text-muted-foreground mb-2">{trend.description}</p>
                    <Badge variant="outline">{trend.importance}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Job Recommendations */}
          {jobSuggestions.length > 0 && (
            <Card className="border-2 mb-6 animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <CardTitle>AI-Suggested Job Roles</CardTitle>
                </div>
                <CardDescription>Roles matching your skill profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobSuggestions.map((job: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg border hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-muted-foreground">{job.salary}</p>
                      </div>
                      <Badge variant={parseInt(job.match) >= 80 ? 'default' : 'outline'}>
                        {job.match}% Match
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.skills?.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                    {job.links && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t">
                        <Button variant="outline" size="sm" asChild>
                          <a href={job.links.naukri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Naukri.com
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={job.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            LinkedIn
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={job.links.indeed} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Indeed India
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Learning Roadmap */}
          {roadmap.length > 0 && (
            <Card className="border-2 animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>6-Month Learning Roadmap</CardTitle>
                </div>
                <CardDescription>AI-generated personalized learning path</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roadmap.map((phase: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg border hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{phase.phase}</h3>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Topics to Learn:</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.topics?.map((topic: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      {phase.resources && phase.resources.length > 0 && (
                        <>
                          <p className="text-sm font-medium mt-3">Resources:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {phase.resources.map((resource: string, idx: number) => (
                              <li key={idx}>{resource}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default CareerPath;
