import { useState, useEffect } from "react";
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
  CheckCircle2
} from "lucide-react";
import { getAssessmentById, calculateScore } from "@/lib/assessments";
import { Assessment as AssessmentType, Question } from "@/types/assessment";
import CodingQuestion from "@/components/CodingQuestion";
import { toast } from "sonner";

const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isProctoring, setIsProctoring] = useState(true);

  useEffect(() => {
    if (id) {
      const loadedAssessment = getAssessmentById(id);
      if (loadedAssessment) {
        setAssessment(loadedAssessment);
        setTimeRemaining(loadedAssessment.duration * 60); // Convert to seconds
      }
    }
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

  const handleSubmit = () => {
    if (!assessment) return;

    const result = calculateScore(assessment.questions, answers);
    
    // Store result in localStorage for demo
    localStorage.setItem('lastAssessmentResult', JSON.stringify({
      ...result,
      assessmentTitle: assessment.title,
      totalQuestions: assessment.questions.length,
      timeTaken: assessment.duration * 60 - timeRemaining,
    }));

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
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
