import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileCode, Target, Layers } from 'lucide-react';
import { assessmentTemplates } from '@/lib/assessments';

const Assessments = () => {
  const navigate = useNavigate();

  const categoryIcons: Record<string, any> = {
    Technical: Layers,
    Aptitude: Target,
    Coding: FileCode,
    'Full Stack': Layers,
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Assessments</h1>
        <p className="text-muted-foreground text-lg">
          Choose an assessment to test your skills
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {assessmentTemplates.map((assessment) => {
          const Icon = categoryIcons[assessment.category] || Target;
          return (
            <Card
              key={assessment.id}
              className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-primary">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{assessment.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {assessment.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base mt-3">
                  {assessment.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{assessment.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>{assessment.totalQuestions} questions</span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate(`/assessment/${assessment.id}`)}
                  className="w-full group-hover:bg-gradient-primary"
                >
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Assessments;
