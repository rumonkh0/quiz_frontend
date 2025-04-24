"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchQuizDetails } from "@/store/slices/quizSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function QuizResults({
  params,
}: {
  params: { id: string; quizId: string };
}) {
  const dispatch = useAppDispatch();
  const {
    currentQuiz: quiz,
    loading,
    error,
  } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizDetails(params.quizId));
  }, [dispatch, params.quizId]);

  if (error) {
    toast.error(error);
  }

  // This would need to be populated from your API with the user's results
  // You'll need to expand your API to return the user's answers and score
  const userResult = quiz?.results?.find(
    (result) => result.userId === "current-user-id"
  ) || {
    score: 75,
    totalQuestions: quiz?.questions?.length || 0,
    correctAnswers: Math.floor((quiz?.questions?.length || 0) * 0.75),
    submittedAt: new Date().toISOString(),
    answers: [],
  };

  return (
    <div className="container mx-auto p-6">
      <Link
        href={`/student/classroom/${params.id}`}
        className="inline-flex items-center mb-6 text-sm hover:underline"
      >
        &larr; Back to Class
      </Link>

      {loading || !quiz ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Quiz Results: {quiz.title}</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Score</CardTitle>
              <CardDescription>
                Completed on{" "}
                {new Date(userResult.submittedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-6xl font-bold mb-2">
                  {userResult.score}%
                </div>
                <p className="text-muted-foreground">
                  {userResult.correctAnswers} out of {userResult.totalQuestions}{" "}
                  correct
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-semibold">
                    {userResult.correctAnswers}
                  </div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-semibold">
                    {userResult.totalQuestions - userResult.correctAnswers}
                  </div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-4">Question Breakdown</h2>

          <div className="space-y-4">
            {quiz.questions?.map((question, index) => {
              // This is simulated data since we don't have the actual user answers
              // You'll need to adapt this to use the actual user answers from your API
              const userAnswer = userResult.answers.find(
                (a) => a.questionId === question._id
              );
              const isCorrect = index % 3 !== 0; // Simulate some correct and incorrect answers

              return (
                <Card
                  key={question._id}
                  className={`border-l-4 ${
                    isCorrect ? "border-l-green-500" : "border-l-red-500"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Question {index + 1}
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-foreground mt-1">
                          {question.text}
                        </CardDescription>
                      </div>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isUserAnswer =
                          userAnswer?.answerId === option._id;
                        const isCorrectAnswer = option.isCorrect;

                        let className = "py-2 px-3 rounded-md text-sm ";
                        if (isUserAnswer && isCorrectAnswer) {
                          className += "bg-green-100 border border-green-200";
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          className += "bg-red-100 border border-red-200";
                        } else if (isCorrectAnswer) {
                          className += "bg-green-50 border border-green-100";
                        } else {
                          className += "bg-muted";
                        }

                        return (
                          <div key={option._id} className={className}>
                            <div className="flex items-center">
                              <div className="flex-1">{option.text}</div>
                              {isUserAnswer && (
                                <Badge
                                  variant={
                                    isCorrectAnswer ? "success" : "destructive"
                                  }
                                  className="ml-2"
                                >
                                  Your Answer
                                </Badge>
                              )}
                              {isCorrectAnswer && !isUserAnswer && (
                                <Badge variant="outline" className="ml-2">
                                  Correct Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link href={`/student/classroom/${params.id}`}>
              <Button>Back to Class</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
