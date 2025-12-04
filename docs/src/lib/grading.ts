import {
  QuestionResult,
  MultipleChoiceAnswer,
} from "../types/question";

/**
 * 選択式問題の採点
 */
export function gradeMultipleChoice(
  userAnswer: string[],
  correctAnswer: MultipleChoiceAnswer
): QuestionResult {
  const userSet = new Set(userAnswer);
  const correctSet = new Set(correctAnswer.correct);

  const isCorrect =
    userSet.size === correctSet.size &&
    [...userSet].every((id) => correctSet.has(id));

  return {
    isCorrect,
    userAnswer: { format: "multipleChoice", selected: userAnswer },
    correctAnswer,
  };
}
