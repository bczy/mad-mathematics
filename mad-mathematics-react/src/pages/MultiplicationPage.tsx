/**
 * MultiplicationPage - Mad Mathematics
 * Main multiplication game page with 3-state flow: Selection → Game → Results
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { useGameTimer } from '../hooks/useGameTimer';
import { useGameLogic } from '../hooks/useGameLogic';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import {
  Button,
  Card,
  Timer,
  ProgressBar,
  QuestionDisplay,
  DifficultySelector,
  PlayerNameInput,
  ResultsPanel,
} from '../components';
import { MULTIPLICATION_DIFFICULTIES, createHighscoreKey } from '../types';
import type { Difficulty, Answer, Question } from '../types';

/**
 * Multiplication game page component
 * Implements the full game flow for practicing multiplication tables
 */
export function MultiplicationPage() {
  // Store state and actions
  const status = useStore((state) => state.status);
  const difficulty = useStore((state) => state.difficulty);
  const questions = useStore((state) => state.questions);
  const currentQuestionIndex = useStore((state) => state.currentQuestionIndex);
  const answers = useStore((state) => state.answers);
  const score = useStore((state) => state.score);
  const timeElapsed = useStore((state) => state.timeElapsed);
  const playerName = useStore((state) => state.playerName);

  const startGame = useStore((state) => state.startGame);
  const submitAnswer = useStore((state) => state.submitAnswer);
  const setTimeElapsed = useStore((state) => state.setTimeElapsed);
  const setTimerExpired = useStore((state) => state.setTimerExpired);
  const finishGame = useStore((state) => state.finishGame);
  const resetGame = useStore((state) => state.resetGame);
  const addHighscore = useStore((state) => state.addHighscore);

  // Game logic hook
  const { generateQuestions } = useGameLogic({ operation: '×' });

  // Track if highscore was saved
  const highscoreSavedRef = useRef(false);
  const [isInTop5, setIsInTop5] = useState(false);

  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const timeLimit = difficulty?.timeLimit ?? 60;

  // Timer hook
  const {
    isRunning: timerIsRunning,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useGameTimer({
    timeLimit,
    onTick: (elapsed) => {
      setTimeElapsed(elapsed);
    },
    onTimeout: () => {
      setTimerExpired();
      handleGameFinish();
    },
    autoStart: false,
  });

  // Handle game finish
  const handleGameFinish = useCallback(() => {
    stopTimer();
    finishGame();
  }, [stopTimer, finishGame]);

  // Handle answer submission
  const handleSubmitAnswer = useCallback(
    (userAnswer: number | null) => {
      if (!currentQuestion) return;

      // submitAnswer calculates isCorrect internally
      submitAnswer(userAnswer, userAnswer === null);

      // Check if game is complete
      if (currentQuestionIndex >= totalQuestions - 1) {
        handleGameFinish();
      }
    },
    [currentQuestion, currentQuestionIndex, totalQuestions, submitAnswer, handleGameFinish]
  );

  // Handle difficulty selection and game start
  const handleStartGame = useCallback(
    (selectedDifficulty: Difficulty) => {
      const generatedQuestions = generateQuestions(selectedDifficulty);
      startGame(selectedDifficulty, generatedQuestions);
      highscoreSavedRef.current = false;
      setIsInTop5(false);
      resetTimer();
      startTimer();
    },
    [generateQuestions, startGame, resetTimer, startTimer]
  );

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    resetGame();
    resetTimer();
  }, [resetGame, resetTimer]);

  // Save highscore when game finishes
  useEffect(() => {
    if (status === 'results' && difficulty && !highscoreSavedRef.current) {
      highscoreSavedRef.current = true;
      const storageKey = createHighscoreKey('multiplication', difficulty.id);
      const result = addHighscore(storageKey, {
        name: playerName || 'Anonyme',
        score,
        time: timeElapsed,
        date: new Date().toISOString(),
      });
      setIsInTop5(result);
    }
  }, [status, difficulty, playerName, score, timeElapsed, addHighscore]);

  // Keyboard shortcuts
  useKeyboardInput({
    onEscape: handlePlayAgain,
    enabled: status === 'results',
  });

  // Render based on game status
  if (status === 'selection') {
    return <SelectionScreen onStart={handleStartGame} />;
  }

  if (status === 'playing') {
    return (
      <GameScreen
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeElapsed={timeElapsed}
        timeLimit={timeLimit}
        isRunning={timerIsRunning}
        onSubmit={handleSubmitAnswer}
        onSkip={() => handleSubmitAnswer(null)}
      />
    );
  }

  // status === 'results'
  return (
    <ResultsScreen
      score={score}
      totalQuestions={totalQuestions}
      timeElapsed={timeElapsed}
      answers={answers}
      difficulty={difficulty!}
      isInTop5={isInTop5}
      playerName={playerName || 'Anonyme'}
      onPlayAgain={handlePlayAgain}
      onChangeDifficulty={handlePlayAgain}
    />
  );
}

// ========== Sub-components ==========

interface SelectionScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

function SelectionScreen({ onStart }: SelectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">
            🧙‍♂️ Tables de Multiplication 🧙‍♂️
          </h1>
          <p className="text-purple-200">
            Entraîne-toi et deviens un maître des multiplications !
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-purple-200 text-sm font-medium mb-2">
            Ton nom de sorcier
          </label>
          <PlayerNameInput className="w-full" />
        </div>

        <div className="mb-6">
          <label className="block text-purple-200 text-sm font-medium mb-3">
            Choisis ta difficulté
          </label>
          <DifficultySelector
            difficulties={MULTIPLICATION_DIFFICULTIES}
            onSelect={onStart}
          />
        </div>

        <div className="text-center">
          <Link to="/">
            <Button variant="ghost" size="sm">
              ← Retour à l'accueil
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

interface GameScreenProps {
  question: Question | undefined;
  questionNumber: number;
  totalQuestions: number;
  timeElapsed: number;
  timeLimit: number;
  isRunning: boolean;
  onSubmit: (answer: number | null) => void;
  onSkip: () => void;
}

function GameScreen({
  question,
  questionNumber,
  totalQuestions,
  timeElapsed,
  timeLimit,
  isRunning,
  onSubmit,
  onSkip,
}: GameScreenProps) {
  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-amber-400">
            🧙‍♂️ Multiplication 🧙‍♂️
          </h1>
        </div>

        {/* Timer */}
        <div className="mb-4">
          <Timer
            timeLimit={timeLimit}
            timeElapsed={timeElapsed}
            isRunning={isRunning}
          />
        </div>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar
            current={questionNumber - 1}
            max={totalQuestions}
            label={`Question ${questionNumber}/${totalQuestions}`}
          />
        </div>

        {/* Question */}
        <QuestionDisplay
          question={question}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          onSubmit={onSubmit}
          onSkip={onSkip}
        />
      </Card>
    </div>
  );
}

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  timeElapsed: number;
  answers: Answer[];
  difficulty: Difficulty;
  isInTop5: boolean;
  playerName: string;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

function ResultsScreen({
  score,
  totalQuestions,
  timeElapsed,
  answers,
  difficulty,
  isInTop5,
  playerName,
  onPlayAgain,
  onChangeDifficulty,
}: ResultsScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <ResultsPanel
          gameType="multiplication"
          difficulty={difficulty}
          score={score}
          totalQuestions={totalQuestions}
          timeTaken={timeElapsed}
          answers={answers}
          madeHighscore={isInTop5}
          playerName={playerName}
          onPlayAgain={onPlayAgain}
          onChangeDifficulty={onChangeDifficulty}
        />
      </Card>
    </div>
  );
}

export default MultiplicationPage;
