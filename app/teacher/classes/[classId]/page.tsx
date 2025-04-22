"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Clock, Users, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewQuiz, fetchClassQuizzes } from "@/store/slices/quizSlice";
import { getClassById } from "@/store/slices/classroomSlice";
import AuthGuard from "@/components/auth/auth-guard";
import { TeacherDashboardLayout } from "@/components/TeacherDashboardLayout";

export default function ClassDetailPage() {
  const { classId } = useParams();
  const dispatch = useAppDispatch();
  const {
    quizzes,
    loading: quizLoading,
    error: quizError,
  } = useAppSelector((state) => state.quiz);
  const {
    selectedClass,
    loading: classLoading,
    error: classError,
  } = useAppSelector((state) => state.classroom);

  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [, setNewQuizQuestions] = useState("");
  const [newQuizDuration, setNewQuizDuration] = useState("");
  const [startsOn, setStartsOn] = useState(""); // New state for startsOn date
  const [isActive, setIsActive] = useState(true); // Default isActive to true

  useEffect(() => {
    if (classId) {
      dispatch(getClassById(classId as string));
      dispatch(fetchClassQuizzes(classId as string));
    }
  }, [dispatch, classId]);

  const handleCreateQuiz = async () => {
    if (newQuizTitle.trim() && newQuizDuration && startsOn) {
      await dispatch(
        createNewQuiz({
          classroomId: classId as string,
          title: newQuizTitle,
          duration: parseInt(newQuizDuration),
          startsOn: new Date(startsOn),
          isActive: isActive,
        })
      );
      setNewQuizTitle("");
      setNewQuizQuestions("");
      setNewQuizDuration("");
      setStartsOn(""); // Reset the startsOn field
      setIsActive(true); // Reset the isActive field
    }
  };

  if (classLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (classError) {
    return <div className="text-red-500 p-4">Error: {classError}</div>;
  }

  if (!selectedClass) {
    // return <div className="p-4">Classroom not found</div>;
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard requiredRoles={["teacher"]}>
      <TeacherDashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{selectedClass.name}</h1>
              <p className="text-muted-foreground">
                Class Code: {selectedClass.code}
              </p>
              {selectedClass.teacher && (
                <p className="text-sm text-muted-foreground mt-1">
                  Teacher: {selectedClass.teacher.firstName}{" "}
                  {selectedClass.teacher.lastName}
                </p>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={quizLoading}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {quizLoading ? "Creating..." : "Create Quiz"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Quiz</DialogTitle>
                  <DialogDescription>
                    Set up your quiz details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="quizTitle">Quiz Title</Label>
                    <Input
                      id="quizTitle"
                      value={newQuizTitle}
                      onChange={(e) => setNewQuizTitle(e.target.value)}
                      placeholder="e.g., Midterm Review"
                      disabled={quizLoading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (mins)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newQuizDuration}
                        onChange={(e) => setNewQuizDuration(e.target.value)}
                        disabled={quizLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startsOn">Starts On</Label>
                      <Input
                        id="startsOn"
                        type="datetime-local"
                        value={startsOn}
                        onChange={(e) => setStartsOn(e.target.value)}
                        disabled={quizLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isActive">Active</Label>
                      <input
                        id="isActive"
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        disabled={quizLoading}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateQuiz} disabled={quizLoading}>
                    {quizLoading ? "Creating..." : "Create Quiz"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {quizError && <div className="text-red-500">{quizError}</div>}

          <Tabs defaultValue="quizzes">
            <TabsList>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            <TabsContent value="quizzes" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {quizzes?.length > 0 ? (
                  quizzes.map((quiz) => (
                    <Link
                      href={`/teacher/classes/${classId}/quiz/${quiz._id}`}
                      key={quiz._id}
                      className="block"
                    >
                      <Card className="h-full transition-all hover:shadow-md">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            {quiz.title}
                            {quiz.isActive && (
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                Active
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription>
                            Created:{" "}
                            {new Date(quiz.createdAt).toLocaleDateString()}
                            <div>
                              <strong>Start Date: </strong>
                              {new Date(quiz.startsOn).toLocaleString()}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span>{quiz.duration} mins</span>
                            </div>
                            <div>
                              {/* <span>{quiz.questions.length} questions</span> */}
                              <span>55 questions</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div>No quizzes available</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="students" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Students</CardTitle>
                  <CardDescription>Class participants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedClass.students?.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                            <Users className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p>Completed: {student.completedQuizzes} quizzes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </TeacherDashboardLayout>
    </AuthGuard>
  );
}
