"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PlusCircle, Trash2, GripVertical, Clock, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByQuiz,
} from "@/store/slices/questionSlice";
import { fetchQuizDetails, updateQuiz } from "@/store/slices/quizSlice";
import { TeacherDashboardLayout } from "@/components/TeacherDashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Question } from "@/types/quiz.type";
// import { Pencil } from "lucide-react";

export default function TeacherQuizPage() {
  const { quizId } = useParams<{ classId: string; quizId: string }>();
  const dispatch = useAppDispatch();
  const { currentQuiz, loading: quizLoading } = useAppSelector(
    (state) => state.quiz
  );
  const { questions, loading, error } = useAppSelector(
    (state) => state.question
  );

  const [isActive, setIsActive] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [isEditingStartson, setIsEditingStartson] = useState(false);

  const [editedTitle, setEditedTitle] = useState("");
  const [editedDuration, setEditedDuration] = useState("");
  const [editedStartson, setEditedStartson] = useState(() => {
    if (currentQuiz?.startsOn) {
      return new Date(currentQuiz.startsOn).toISOString().slice(0, 16);
    }
    return "";
  });
  // When currentQuiz is fetched and available, update the states
  useEffect(() => {
    if (currentQuiz) {
      setIsActive(currentQuiz.isActive);
      setEditedTitle(currentQuiz.title);
      setEditedDuration(currentQuiz.duration.toString());
      setEditedStartson(
        new Date(currentQuiz.startsOn).toISOString().slice(0, 16) || ""
      );
    }
  }, [currentQuiz]);

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizDetails(quizId));
      dispatch(getQuestionsByQuiz(quizId));
    }
  }, [dispatch, quizId]);

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingQuestion(null);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    if (!questionText.trim() || options.some((opt) => !opt.trim())) {
      return;
    }

    const payload = {
      quiz: quizId,
      text: questionText.trim(),
      options: options.map((opt) => opt.trim()),
      correctAnswer,
    };

    if (editingQuestion) {
      await dispatch(
        updateQuestion({ id: editingQuestion._id, questionData: payload })
      );
    } else {
      await dispatch(createQuestion(payload));
    }

    resetForm();
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setQuestionText(question.text);
    // Ensure we always have 4 options for consistency with the design
    const paddedOptions = [...question.options];
    while (paddedOptions.length < 4) {
      paddedOptions.push("");
    }
    setOptions(paddedOptions.slice(0, 4));
    setCorrectAnswer(question.correctAnswer);
    setIsDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!currentQuiz) return;
    dispatch(
      updateQuiz({
        quizId: currentQuiz._id,
        updatedData: {
          title: editedTitle,
          duration: Number(editedDuration),
          startsOn: new Date(editedStartson),
          isActive: isActive,
        },
      })
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      await dispatch(deleteQuestion(id));
    }
  };
  if (quizLoading || !currentQuiz) {
    return (
      <TeacherDashboardLayout>
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </TeacherDashboardLayout>
    );
  }
  if (loading) {
    return (
      <TeacherDashboardLayout>
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </TeacherDashboardLayout>
    );
  }

  if (error) {
    return (
      <TeacherDashboardLayout>
        <div className="text-red-500 p-4">Error: {error}</div>
      </TeacherDashboardLayout>
    );
  }

  return (
    <TeacherDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            {/* Title */}
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <Input
                  className="w-auto"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{editedTitle}</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    ✏️
                  </Button>
                </>
              )}
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {isEditingDuration ? (
                <Input
                  className="w-20"
                  value={editedDuration}
                  onChange={(e) => setEditedDuration(e.target.value)}
                  onBlur={() => setIsEditingDuration(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingDuration(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <span>{editedDuration} minutes</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => setIsEditingDuration(true)}
                  >
                    ✏️
                  </Button>
                </>
              )}
            </div>

            {/* Startson */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Start Date:</span>
              {isEditingStartson ? (
                <Input
                  type="datetime-local"
                  className="w-auto"
                  value={editedStartson}
                  onChange={(e) => setEditedStartson(e.target.value)}
                  onBlur={() => setIsEditingStartson(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingStartson(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <span>
                    {editedStartson
                      ? new Date(editedStartson).toLocaleString()
                      : "Not set"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => setIsEditingStartson(true)}
                  >
                    ✏️
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active">{isActive ? "Active" : "Inactive"}</Label>
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question._id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <GripVertical className="mt-1 h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">
                      Question {index + 1}
                    </CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleEdit(question)} // 👈 EDIT button
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(question._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardDescription className="ml-7 mt-2 text-base font-medium text-foreground">
                  {question.text}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue={question.correctAnswer.toString()}
                  className="ml-7 space-y-2"
                >
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex items-center space-x-2 rounded-md border p-3"
                    >
                      <RadioGroupItem
                        value={optIndex.toString()}
                        id={`q${question._id}-opt${optIndex}`}
                      />
                      <Label
                        htmlFor={`q${question._id}-opt${optIndex}`}
                        className="flex-1"
                      >
                        {option}
                      </Label>
                      {optIndex === question.correctAnswer && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Edit Question" : "Add a New Question"}
              </DialogTitle>
              <DialogDescription>
                {editingQuestion
                  ? "Update this question"
                  : "Create a multiple-choice question with four options."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter your question here"
                  className="min-h-20"
                />
              </div>
              <div className="space-y-4">
                <Label>Options</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroup
                      value={correctAnswer.toString()}
                      onValueChange={(value) =>
                        setCorrectAnswer(Number.parseInt(value))
                      }
                      className="flex items-center"
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                      />
                    </RadioGroup>
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                  </div>
                ))}
                <div className="text-sm text-muted-foreground">
                  Select the radio button next to the correct answer.
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>
                {editingQuestion ? "Update" : "Add"} Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherDashboardLayout>
  );
}
