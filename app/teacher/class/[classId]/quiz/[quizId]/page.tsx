'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchQuizDetails } from '@/store/slices/quizSlice';

export default function QuizDetailsPage() {
  const { classId, quizId } = useParams();
  const dispatch = useAppDispatch();
  const { currentQuiz, loading, error } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizDetails(quizId as string));
  }, [dispatch, quizId]);

  if (loading) return <div>Loading quiz details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{currentQuiz?.title}</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium">Duration</h3>
          <p>{currentQuiz?.duration} minutes</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium">Questions</h3>
          <p>{currentQuiz?.questions?.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium">Status</h3>
          <p>{currentQuiz?.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      </div>
    </div>
  );
}