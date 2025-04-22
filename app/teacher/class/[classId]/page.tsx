'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Clock, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createQuiz, fetchClassQuizzes } from '@/store/slices/quizSlice';

export default function ClassDetailPage() {
  const { classId } = useParams();
  const dispatch = useAppDispatch();
  const { quizzes, loading, error } = useAppSelector((state) => state.quiz);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizQuestions, setNewQuizQuestions] = useState('');
  const [newQuizDuration, setNewQuizDuration] = useState('');

  useEffect(() => {
    dispatch(fetchClassQuizzes(classId as string));
  }, [dispatch, classId]);

  const handleCreateQuiz = async () => {
    if (newQuizTitle.trim() && newQuizDuration && newQuizQuestions) {
      await dispatch(createQuiz({
        classId: classId as string,
        title: newQuizTitle,
        duration: parseInt(newQuizDuration),
        questionCount: parseInt(newQuizQuestions)
      }));
      setNewQuizTitle('');
      setNewQuizQuestions('');
      setNewQuizDuration('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Biology 101</h1>
          <p className="text-muted-foreground">Class Code: BIO101</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={loading}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {loading ? 'Creating...' : 'Create Quiz'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
              <DialogDescription>Set up your quiz details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quizTitle">Quiz Title</Label>
                <Input
                  id="quizTitle"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="e.g., Midterm Review"
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="questions">Questions</Label>
                  <Input
                    id="questions"
                    type="number"
                    value={newQuizQuestions}
                    onChange={(e) => setNewQuizQuestions(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newQuizDuration}
                    onChange={(e) => setNewQuizDuration(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateQuiz} disabled={loading}>
                {loading ? 'Creating...' : 'Create Quiz'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <Tabs defaultValue="quizzes">
        <TabsList>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="students">Students (24)</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Link href={`/teacher/class/${classId}/quiz/${quiz._id}`} key={quiz._id} className="block">
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
                      Created: {new Date(quiz.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{quiz.duration} mins</span>
                      </div>
                      <div>
                        <span>{quiz.questions.length} questions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
                {Array.from({ length: 24 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        <Users className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium">Student {index + 1}</p>
                        <p className="text-sm text-muted-foreground">student{index + 1}@example.com</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p>Completed: {Math.floor(Math.random() * 5)} quizzes</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}