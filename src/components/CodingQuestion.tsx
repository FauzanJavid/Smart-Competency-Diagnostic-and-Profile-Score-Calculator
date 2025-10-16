import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, CheckCircle2, XCircle, Code2, AlertCircle } from "lucide-react";
import { Question } from "@/types/assessment";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CodingQuestionProps {
  question: Question;
  onCodeChange: (code: string) => void;
  initialCode?: string;
}

const CodingQuestion = ({ question, onCodeChange, initialCode }: CodingQuestionProps) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(initialCode || question.starter_code?.javascript || "");
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; message: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  const languageOptions = [
    { value: "javascript", label: "JavaScript", monacoLang: "javascript" },
    { value: "python", label: "Python", monacoLang: "python" },
    { value: "java", label: "Java", monacoLang: "java" },
    { value: "cpp", label: "C++", monacoLang: "cpp" },
  ];

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const starterCode = question.starter_code?.[newLanguage as keyof typeof question.starter_code] || "";
    setCode(starterCode);
    onCodeChange(starterCode);
  };

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: {
          code,
          language,
          testCases: question.test_cases || [],
        },
      });

      if (error) {
        toast.error('Failed to execute code');
        console.error('Execution error:', error);
        setIsRunning(false);
        return;
      }

      const results = data.results || [];
      setTestResults(results);
      setIsRunning(false);
      
      const passedCount = results.filter((r: any) => r.passed).length;
      if (passedCount === results.length) {
        toast.success(`All ${results.length} test cases passed! ✅`);
      } else {
        toast.warning(`${passedCount}/${results.length} test cases passed`);
      }
    } catch (error) {
      console.error('Error running tests:', error);
      toast.error('Failed to execute code');
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Problem Description */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm">{question.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {question.examples?.map((example, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-2">Example {index + 1}:</p>
                  <pre className="text-sm"><strong>Input:</strong> {example.input}</pre>
                  <pre className="text-sm"><strong>Output:</strong> {example.output}</pre>
                  {example.explanation && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Explanation:</strong> {example.explanation}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="constraints" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                {question.constraints?.map((constraint, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Code Editor */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Code Editor</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                size="sm" 
                onClick={handleRunTests}
                disabled={isRunning}
                className="bg-gradient-primary text-primary-foreground"
              >
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? "Running..." : "Run Tests"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="450px"
              language={languageOptions.find(l => l.value === language)?.monacoLang || "javascript"}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: language === "python" ? 4 : 2,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result: any, index: number) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    result.passed 
                      ? 'bg-green-500/10 border-green-500/50' 
                      : 'bg-red-500/10 border-red-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Test Case {index + 1}</span>
                      <Badge variant={result.passed ? "default" : "destructive"}>
                        {result.status}
                      </Badge>
                    </div>
                    {result.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Input: </span>
                      <code className="bg-muted px-2 py-1 rounded">{result.message.replace('Input: ', '')}</code>
                    </div>
                    <div>
                      <span className="font-medium">Expected: </span>
                      <code className="bg-muted px-2 py-1 rounded">{result.expected}</code>
                    </div>
                    <div>
                      <span className="font-medium">Output: </span>
                      <code className={`px-2 py-1 rounded ${
                        result.passed ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>{result.output || 'No output'}</code>
                    </div>
                    {result.error && (
                      <div className="flex items-start gap-2 mt-2 p-2 bg-destructive/10 rounded">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span className="text-destructive text-xs">{result.error}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodingQuestion;
