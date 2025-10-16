import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, CheckCircle2, XCircle, Code2 } from "lucide-react";
import { Question } from "@/types/assessment";
import { toast } from "sonner";

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
    
    // Simulate test execution
    setTimeout(() => {
      const results = question.test_cases?.map((testCase, index) => ({
        passed: Math.random() > 0.3, // Random for demo
        message: `Test Case ${index + 1}: ${testCase.input}`,
      })) || [];
      
      setTestResults(results);
      setIsRunning(false);
      
      const passedCount = results.filter(r => r.passed).length;
      if (passedCount === results.length) {
        toast.success(`All ${results.length} test cases passed!`);
      } else {
        toast.warning(`${passedCount}/${results.length} test cases passed`);
      }
    }, 1500);
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
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.passed ? 'bg-success/10' : 'bg-destructive/10'
                  }`}
                >
                  <span className="text-sm">{result.message}</span>
                  {result.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
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
