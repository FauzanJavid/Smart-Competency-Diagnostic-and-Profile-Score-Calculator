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
            <Card className="border-2 mb-8 animate-fade-in bg-gradient-to-br from-background via-background to-primary/5">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl md:text-3xl mb-1">Current Tech Trends 2025</CardTitle>
                    <CardDescription className="text-base">AI-powered insights on emerging industry trends</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {trends.map((trend: any, index: number) => (
                  <div 
                    key={index} 
                    className="group p-6 rounded-xl border-2 bg-card hover:border-primary/60 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors flex-1">
                        {trend.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/10 text-primary border-primary/20 font-semibold self-start"
                      >
                        {trend.importance}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {trend.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Job Recommendations */}
          {jobSuggestions.length > 0 && (
            <Card className="border-2 mb-8 animate-fade-in bg-gradient-to-br from-background via-background to-secondary/5">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">AI-Suggested Job Roles</CardTitle>
                    <CardDescription className="text-base mt-1">Personalized roles matching your skill profile</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {jobSuggestions.map((job: any, index: number) => (
                  <div key={index} className="group p-5 rounded-xl border-2 bg-card hover:border-primary/60 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground font-medium text-base">{job.salary}</p>
                      </div>
                      <Badge 
                        variant={parseInt(job.match) >= 80 ? 'default' : 'outline'}
                        className="ml-3 text-sm px-3 py-1"
                      >
                        {job.match}% Match
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills?.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {job.links && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                        <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground">
                          <a href={job.links.naukri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Naukri.com
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground">
                          <a href={job.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                            <ExternalLink className="h-3.5 w-3.5" />
                            LinkedIn
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground">
                          <a href={job.links.indeed} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                            <ExternalLink className="h-3.5 w-3.5" />
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
            <Card className="border-2 animate-fade-in bg-gradient-to-br from-background via-background to-accent/5">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">6-Month Learning Roadmap</CardTitle>
                    <CardDescription className="text-base mt-1">Your AI-generated personalized learning journey</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {roadmap.map((phase: any, index: number) => (
                  <div key={index} className="group p-5 rounded-xl border-2 bg-card hover:border-primary/60 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                        {phase.phase}
                      </h3>
                      <Badge variant="secondary" className="bg-accent/10 text-primary border-accent/20 font-semibold text-sm px-3 py-1">
                        {phase.duration}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Topics to Master:</p>
                        <div className="flex flex-wrap gap-2">
                          {phase.topics?.map((topic: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-sm">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {phase.resources && phase.resources.length > 0 && (
                        <div className="pt-3 border-t border-border/50">
                          <p className="text-sm font-semibold text-foreground mb-2">Recommended Resources:</p>
                          <ul className="space-y-1.5 text-sm text-muted-foreground">
                            {phase.resources.map((resource: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="flex-1">{resource}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
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
