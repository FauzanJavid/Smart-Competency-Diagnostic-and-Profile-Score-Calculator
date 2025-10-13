import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import codingQuestions from '@/data/coding_questions.json';

const CodingAssessment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Coding Challenges</h1>
          <p className="text-muted-foreground text-lg">
            Test your programming skills with real-world problems
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {codingQuestions.map((question, index) => (
            <Card 
              key={index}
              className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Code2 className="h-6 w-6 text-primary" />
                  <Badge variant={
                    question.difficulty.toLowerCase() === 'easy' ? 'secondary' :
                    question.difficulty.toLowerCase() === 'medium' ? 'outline' : 'destructive'
                  }>
                    {question.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{question.question_text}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {question.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{question.time_limit || 30} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>100 pts</span>
                  </div>
                </div>
                <Button 
                  className="w-full group-hover:bg-gradient-primary"
                  onClick={() => navigate(`/assessment/coding-${index}`)}
                >
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodingAssessment;
