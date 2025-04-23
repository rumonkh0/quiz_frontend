"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeacherDashboardLayout } from "@/components/TeacherDashboardLayout";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { getTeacherClasses, createClass } from "@/store/slices/classroomSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthGuard from "@/components/auth/auth-guard";

export default function TeacherDashboard() {
  const dispatch = useAppDispatch();
  const { classes, loading, error } = useAppSelector(
    (state) => state.classroom
  );
  const [newClassName, setNewClassName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getTeacherClasses());
  }, [dispatch]);

  const handleCreateClass = async () => {
    if (newClassName.trim()) {
      try {
        await dispatch(createClass({ name: newClassName })).unwrap();
        setNewClassName("");
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Failed to create class:", error);
      }
    }
  };

  return (
    <AuthGuard requiredRoles={["teacher"]}>
      <TeacherDashboardLayout>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Classes</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Class</DialogTitle>
                <DialogDescription>
                  Enter a name for your new class. You can add quizzes to it
                  later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Class Name</Label>
                  <Input
                    id="className"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g., Biology 101"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateClass} disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create Class
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              // <Link href={`/teacher/classes/${cls._id}`} key={cls._id} className="block">
              <Card
                key={cls._id}
                className="h-full transition-all hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>Class Code: {cls.code}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Students</p>
                      {/* <p className="font-medium">{cls.studentsCount}</p> */}
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quizzes</p>
                      {/* <p className="font-medium">{cls.quizzesCount}</p> */}
                    </div>
                  </div>
                </CardContent><Link
                    href={`/teacher/classes/${cls._id}`}
                    key={cls._id}
                  >
                <CardFooter>
                  
                    <Button variant="ghost" className="w-full" asChild>
                      <div>Manage Class</div>
                    </Button>
                </CardFooter>
                  </Link>
              </Card>
            ))}
          </div>
        )}
      </TeacherDashboardLayout>
    </AuthGuard>
  );
}
