import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  Shield,
  CheckCircle2,
  Maximize,
  Minimize
} from "lucide-react";
import { getAssessmentById, calculateScore } from "@/lib/assessments";
import { Assessment as AssessmentType, Question } from "@/types/assessment";
import CodingQuestion from "@/components/CodingQuestion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isProctoring, setIsProctoring] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const loadedAssessment = getAssessmentById(id);
      if (loadedAssessment) {
        setAssessment(loadedAssessment);
        setTimeRemaining(loadedAssessment.duration * 60); // Convert to seconds
        // Request fullscreen on load
        requestFullscreen();
      }
    }

    // Handle fullscreen change events
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        toast.warning("Please stay in fullscreen mode during the assessment");
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [id]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (assessment && currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const requestFullscreen = async () => {
    if (containerRef.current && !document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error("Error requesting fullscreen:", error);
        toast.error("Could not enter fullscreen mode");
      }
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        console.error("Error exiting fullscreen:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    const result = calculateScore(assessment.questions, answers);
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Save assessment result to database
    const { error: insertError } = await supabase
      .from('assessment_results')
      .insert({
        user_id: user.id,
        assessment_type: assessment.id,
        score: result.score,
        total_questions: assessment.questions.length,
        answers: result.details,
        time_taken: assessment.duration * 60 - timeRemaining
      });

    if (insertError) {
      console.error('Error saving assessment result:', insertError);
      toast.error('Failed to save assessment results');
      return;
    }

    // Update or create user metrics
    const { data: existingMetrics } = await supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingMetrics) {
      await supabase
        .from('user_metrics')
        .update({
          total_assessments: existingMetrics.total_assessments + 1,
          total_score: existingMetrics.total_score + result.score,
          total_time_spent: existingMetrics.total_time_spent + (assessment.duration * 60 - timeRemaining),
          last_assessment_date: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('user_metrics')
        .insert({
          user_id: user.id,
          total_assessments: 1,
          total_score: result.score,
          total_time_spent: assessment.duration * 60 - timeRemaining,
          last_assessment_date: new Date().toISOString()
        });
    }

    // Store result in localStorage for immediate display
    localStorage.setItem('lastAssessmentResult', JSON.stringify({
      ...result,
      assessmentTitle: assessment.title,
      totalQuestions: assessment.questions.length,
      timeTaken: assessment.duration * 60 - timeRemaining,
    }));

    // Exit fullscreen before navigating
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    toast.success("Assessment submitted successfully!");
    navigate("/results");
  };

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading assessment...</p>
      </div>
    );
  }

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header Bar */}
      <div className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-lg">{assessment.title}</h1>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {assessment.questions.length}
              </Badge>
            </div>
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={isFullscreen ? exitFullscreen : requestFullscreen}
                className="hover:bg-primary/10"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="h-4 w-4 mr-2" />
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize className="h-4 w-4 mr-2" />
                    Fullscreen
                  </>
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Shield className={`h-4 w-4 ${isProctoring ? 'text-success animate-pulse-dot' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium">
                  {isProctoring ? 'Proctoring Active' : 'Proctoring Off'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold">
                <Clock className="h-5 w-5" />
                <span className="text-xl tabular-nums">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
        </div>
      </div>

      {/* Question Area */}
      <div className="container py-8">
        <Card className="border-2 animate-fade-in">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <CardTitle className="text-xl">
                {question.question_text}
              </CardTitle>
              <Badge className={
                question.difficulty === "Easy" ? "bg-success" :
                question.difficulty === "Medium" ? "bg-warning" :
                "bg-destructive"
              }>
                {question.difficulty}
              </Badge>
            </div>
            {question.description && (
              <p className="text-muted-foreground mt-2">{question.description}</p>
            )}
          </CardHeader>
          <CardContent>
            {question.type === "mcq" ? (
              <RadioGroup 
                value={answers[currentQuestion] || ""} 
                onValueChange={handleAnswerChange}
              >
                <div className="space-y-4">
                  {question.options?.map((option, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-all cursor-pointer"
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : question.type === "coding" ? (
              <CodingQuestion 
                question={question}
                onCodeChange={(code) => handleAnswerChange(code)}
                initialCode={answers[currentQuestion] || ""}
              />
            ) : null}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            size="lg"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {assessment.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg border-2 font-medium transition-all ${
                  index === currentQuestion
                    ? 'bg-primary text-primary-foreground border-primary'
                    : answers[index]
                    ? 'bg-success/10 border-success text-success'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === assessment.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-gradient-primary text-primary-foreground"
            >
              <Flag className="mr-2 h-4 w-4" />
              Submit Assessment
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              size="lg"
            >
              Next Question
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
