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
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 break-words">Career Path</h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg break-words">
            AI-powered career guidance based on your skills
          </p>
        </div>
        <Button onClick={refreshSuggestions} disabled={isLoading} className="shrink-0 w-full sm:w-auto">
          <Sparkles className="h-4 w-4 mr-2" />
          <span className="truncate">{isLoading ? 'Generating...' : 'Refresh AI Suggestions'}</span>
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
            <Card className="border-2 mb-6 sm:mb-8 animate-fade-in bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
              <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 shrink-0">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-1 break-words">Current Tech Trends 2025</CardTitle>
                    <CardDescription className="text-sm sm:text-base break-words">AI-powered insights on emerging industry trends</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6">
                {trends.map((trend: any, index: number) => (
                  <div 
                    key={index} 
                    className="group p-4 sm:p-6 rounded-xl border bg-border/40 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 mb-3 sm:mb-4">
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors leading-tight break-words flex-1 min-w-0">
                          {trend.name}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className="bg-primary/10 text-primary border-primary/20 font-medium shrink-0 text-xs px-2 sm:px-2.5 py-1 whitespace-nowrap"
                        >
                          {trend.importance}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm break-words overflow-wrap-anywhere">
                      {trend.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Job Recommendations */}
          {jobSuggestions.length > 0 && (
            <Card className="border-2 mb-6 sm:mb-8 animate-fade-in bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-secondary/10 shrink-0">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl sm:text-2xl break-words">AI-Suggested Job Roles</CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1 break-words">Personalized roles matching your skill profile</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                {jobSuggestions.map((job: any, index: number) => (
                  <div key={index} className="group p-4 sm:p-5 rounded-xl border-2 bg-card hover:border-primary/60 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg sm:text-xl text-foreground mb-1 group-hover:text-primary transition-colors break-words">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground font-medium text-sm sm:text-base break-words">{job.salary}</p>
                      </div>
                      <Badge 
                        variant={parseInt(job.match) >= 80 ? 'default' : 'outline'}
                        className="text-sm px-3 py-1 shrink-0 self-start whitespace-nowrap"
                      >
                        {job.match}% Match
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills?.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs sm:text-sm break-words">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {job.links && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                        <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm">
                          <a href={job.links.naukri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                            <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                            <span className="truncate">Naukri.com</span>
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm">
                          <a href={job.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                            <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                            <span className="truncate">LinkedIn</span>
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm">
                          <a href={job.links.indeed} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                            <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                            <span className="truncate">Indeed India</span>
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
            <Card className="border-2 animate-fade-in bg-gradient-to-br from-background via-background to-accent/5 overflow-hidden">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl sm:text-2xl break-words">6-Month Learning Roadmap</CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1 break-words">Your AI-generated personalized learning journey</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                {roadmap.map((phase: any, index: number) => (
                  <div key={index} className="group p-4 sm:p-5 rounded-xl border-2 bg-card hover:border-primary/60 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors break-words flex-1 min-w-0">
                        {phase.phase}
                      </h3>
                      <Badge variant="secondary" className="bg-accent/10 text-primary border-accent/20 font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-1 shrink-0 self-start whitespace-nowrap">
                        {phase.duration}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">Topics to Master:</p>
                        <div className="flex flex-wrap gap-2">
                          {phase.topics?.map((topic: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs sm:text-sm break-words">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {phase.resources && phase.resources.length > 0 && (
                        <div className="pt-3 border-t border-border/50">
                          <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">Recommended Resources:</p>
                          <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                            {phase.resources.map((resource: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1 shrink-0">•</span>
                                <span className="flex-1 break-words overflow-wrap-anywhere">{resource}</span>
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
