"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getStudentClasses, joinClass } from "@/store/slices/classroomSlice";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { classes, loading, error } = useAppSelector(
    (state) => state.classroom
  );
  const [classCode, setClassCode] = useState("");

  useEffect(() => {
    dispatch(getStudentClasses());
  }, [dispatch]);

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) {
      toast.error("Please enter a class code");
      return;
    }

    try {
      await dispatch(joinClass({ classCode })).unwrap();
      toast.success("Successfully joined the class!");
      setClassCode("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error is already handled in the slice
    }
  };

  if (error) {
    toast.error(error);
  }

  return (
    <StudentDashboardLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.firstName || "Student"} {user?.lastName || ""}
          </h1>
          <p className="text-muted-foreground">
            Manage your classes and quizzes
          </p>
        </div>

        <form onSubmit={handleJoinClass} className="flex gap-2">
          <Input
            placeholder="Enter class code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            className="w-48"
          />
          <Button type="submit" disabled={loading}>
            Join Class
          </Button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">My Classes</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              You haven&apos;t joined any classes yet
            </h2>
            <p className="text-muted-foreground mb-4">
              Join a class using a class code to start learning
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Card key={classItem._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{classItem.name}</CardTitle>
                  <CardDescription>
                    Teacher: {classItem.teacher.firstName}{" "}
                    {classItem.teacher.lastName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Code: {classItem.code}</p>
                  <p className="text-sm">
                    {classItem.students?.length || 0} Students
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/student/classroom/${classItem._id}`}
                    className="w-full"
                  >
                    <Button variant="default" className="w-full">
                      View Class
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}
