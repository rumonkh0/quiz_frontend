"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getClassById } from "@/store/slices/classroomSlice";
import { fetchClassQuizzes } from "@/store/slices/quizSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, FileTextIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout";

export default function ClassroomDetail() {
  // Get the id parameter using useParams hook
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const {
    selectedClass,
    loading: classLoading,
    error: classError,
  } = useAppSelector((state) => state.classroom);
  const {
    quizzes,
    loading: quizzesLoading,
    error: quizzesError,
  } = useAppSelector((state) => state.quiz);

  const loading = classLoading || quizzesLoading;
  const error = classError || quizzesError;
  const [activeTab, setActiveTab] = useState("quizzes");

  useEffect(() => {
    if (id) {
      dispatch(getClassById(id as string));
      dispatch(fetchClassQuizzes(id as string));
    }
  }, [dispatch, id]);

  if (error) {
    toast.error(error);
  }

  return (
    <StudentDashboardLayout>
      <div>
        <Link
          href="/student"
          className="inline-flex items-center mb-6 text-sm hover:underline"
        >
          &larr; Back to Classes
        </Link>

      {loading || !selectedClass ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{selectedClass.name}</h1>
            <p className="text-muted-foreground mt-1">
              Teacher: {selectedClass.teacher.firstName}{" "}
              {selectedClass.teacher.lastName}
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{selectedClass.students?.length || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{quizzes?.length || 0} Quizzes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span>Code: {selectedClass.code}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="students">Classmates</TabsTrigger>
            </TabsList>

            <TabsContent value="quizzes" className="space-y-4">
              {quizzes?.length ? (
                quizzes.map((quiz) => (
                  <Card key={quiz._id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{quiz.title}</CardTitle>
                        <Badge
                          variant={getQuizStatusBadgeVariant(quiz.isActive)}
                        >
                          {quiz.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        {quiz.duration} minutes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">
                        {/*quiz.questions?.length ||*/ 0} Questions
                      </p>
                      {quiz.startsOn && (
                        <p className="text-sm flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Start: {new Date(quiz.startsOn).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      {quiz.isActive ? (
                        <Link
                          href={`/student/classroom/${id}/quiz/${quiz._id}`}
                          className="w-full"
                        >
                          <Button variant="default" className="w-full">
                            Take Quiz
                          </Button>
                        </Link>
                      ) : true ? (
                        <Link
                          href={`/student/classroom/${id}/quiz/${quiz._id}/results`}
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full">
                            View Results
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="w-full">
                          Not Active
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold mb-2">
                    No quizzes available
                  </h2>
                  <p className="text-muted-foreground">
                    The teacher hasn&apos;t created any quizzes yet
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>
                    Your classmates in this class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {selectedClass.students?.map((student) => (
                      <li
                        key={student._id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {student.email}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      </div>
    </StudentDashboardLayout>
  );
}

function getQuizStatusBadgeVariant(isActive: boolean) {
  return isActive ? "default" : "secondary";
}
