"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchQuizDetails, submitQuizAnswers } from "@/store/slices/quizSlice";
import { getQuestionsByQuiz } from "@/store/slices/questionSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TakeQuiz() {
  // Use the useParams hook to get route parameters
  const { id, quizId } = useParams<{ id: string; quizId: string }>();
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentQuiz: quiz, loading: quizLoading, error: quizError } = useAppSelector((state) => state.quiz);
  const { questions, loading: questionsLoading, error: questionsError } = useAppSelector((state) => state.question);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loading = quizLoading || questionsLoading;
  const error = quizError || questionsError;

  // Fetch quiz details and questions when component mounts
  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizDetails(quizId as string));
      dispatch(getQuestionsByQuiz(quizId as string));
    }
  }, [dispatch, quizId]);

  // Set up timer when quiz data is loaded
  useEffect(() => {
    if (quiz?.duration && timeLeft === null) {
      setTimeLeft(quiz.duration * 60); // Convert minutes to seconds
    }
  }, [quiz, timeLeft]);

  // Handle countdown timer
  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const goToNextQuestion = () => {
    if (!questions?.length) return;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!questions?.length || !quizId) return;

    // Check if all questions are answered
    const unansweredQuestions = questions.filter(
      (q) => !answers[q._id]
    );

    if (unansweredQuestions.length > 0 && timeLeft && timeLeft > 0) {
      if (!confirm(`You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Submit answers using the format expected by the API
      await dispatch(
        submitQuizAnswers({
          quizId: quizId as string,
          answers: answers
        })
      ).unwrap();

      toast.success("Quiz submitted successfully!");
      router.push(`/student/classroom/${id}/quiz/${quizId}/results`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (error) {
    toast.error(typeof error === 'string' ? error : 'Failed to load quiz');
  }

  // Show loading or error state if data isn't available yet
  if (!quiz || !questions?.length) {
    return (
      <div className="container mx-auto p-6">
        <Link href={`/student/classroom/${id}`} className="inline-flex items-center mb-6 text-sm hover:underline">
          &larr; Back to Class
        </Link>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Quiz not available</h2>
            <p className="text-muted-foreground">This quiz may not be active or doesn&apos;t exist</p>
            <Button className="mt-4" onClick={() => router.push(`/student/classroom/${id}`)}>
              Go Back to Class
            </Button>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = questions.filter((q) => answers[q._id]).length;

  return (
    <div className="container mx-auto p-6">
      <Link
        href={`/student/classroom/${id}`}
        className="inline-flex items-center mb-6 text-sm hover:underline"
      >
        &larr; Back to Class
      </Link>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <p className="text-muted-foreground mt-1">
              {questions.length} Questions • {quiz.duration} Minutes
            </p>
            {quiz.startsOn && (
              <p className="text-sm text-muted-foreground mt-1">
                Available from: {new Date(quiz.startsOn).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div>
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <Progress value={progress} className="w-32" />
            </div>

            {timeLeft !== null && timeLeft > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className={`font-mono ${timeLeft < 60 ? "text-red-500" : ""}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>

          {answeredCount < questions.length && (
            <Alert variant="default" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have answered {answeredCount} out of {questions.length} questions
            </AlertDescription>
          </Alert>
          )}

          {currentQuestion && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{currentQuestion.text}</CardTitle>
                {/* {currentQuestion.image && (
                  <img
                    src={currentQuestion.image}
                    alt="Question"
                    className="mt-2 max-h-64 object-contain"
                  />
                )} */}
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[currentQuestion._id] || ""}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion._id, value)}
                >
                  {Array.isArray(currentQuestion.options) && currentQuestion.options.map((optionIdx, option) => (
                    <div key={optionIdx} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem value={optionIdx} id={optionIdx} />
                      <Label htmlFor={optionIdx} className="flex-1">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button 
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </Button>
                ) : (
                  <Button onClick={goToNextQuestion}>Next</Button>
                )}
              </CardFooter>
            </Card>
          )}

          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/student/classroom/${id}`)}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}