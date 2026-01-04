/**
 * AdditionPage - Mad Mathematics
 * Addition game page with per-question timer and 4 difficulty levels
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
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
import { ADDITION_DIFFICULTIES, createHighscoreKey } from '../types';
import type { Difficulty, Answer, Question } from '../types';

/**
 * Addition game page component
 * Implements the full game flow for practicing addition
 * Uses per-question time limits instead of total game time
 */
export function AdditionPage() {
  // Store state and actions
  const status = useStore((state) => state.status);
  const difficulty = useStore((state) => state.difficulty);
  const questions = useStore((state) => state.questions);
  const currentQuestionIndex = useStore((state) => state.currentQuestionIndex);
  const answers = useStore((state) => state.answers);
  const score = useStore((state) => state.score);
  const playerName = useStore((state) => state.playerName);

  const startGame = useStore((state) => state.startGame);
  const submitAnswer = useStore((state) => state.submitAnswer);
  const finishGame = useStore((state) => state.finishGame);
  const resetGame = useStore((state) => state.resetGame);
  const addHighscore = useStore((state) => state.addHighscore);

  // Local state for per-question timer
  const [questionTimeElapsed, setQuestionTimeElapsed] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isInTop5, setIsInTop5] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Game logic hook
  const { generateQuestions } = useGameLogic({ operation: '+' });

  // Track if highscore was saved
  const highscoreSavedRef = useRef(false);

  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const timeLimit = difficulty?.timeLimit ?? 30;

  // Start timer for current question
  const startQuestionTimer = useCallback(() => {
    setQuestionTimeElapsed(0);
    
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Only start timer if there's a time limit (0 = unlimited)
    if (timeLimit > 0) {
      setIsTimerRunning(true);
      timerIntervalRef.current = window.setInterval(() => {
        setQuestionTimeElapsed((prev) => {
          const next = prev + 1;
          setTotalTimeSpent((total) => total + 1);
          return next;
        });
      }, 1000);
    }
  }, [timeLimit]);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsTimerRunning(false);
  }, []);

  // Handle game finish
  const handleGameFinish = useCallback(() => {
    stopTimer();
    finishGame();
  }, [stopTimer, finishGame]);

  // Handle answer submission
  const handleSubmitAnswer = useCallback(
    (userAnswer: number | null) => {
      if (!currentQuestion) return;

      stopTimer();
      submitAnswer(userAnswer, userAnswer === null);

      // Check if game is complete
      if (currentQuestionIndex >= totalQuestions - 1) {
        handleGameFinish();
      } else {
        // Start timer for next question after a short delay
        setTimeout(() => {
          startQuestionTimer();
        }, 200);
      }
    },
    [currentQuestion, currentQuestionIndex, totalQuestions, submitAnswer, handleGameFinish, stopTimer, startQuestionTimer]
  );

  // Handle timeout for current question
  useEffect(() => {
    if (timeLimit > 0 && questionTimeElapsed >= timeLimit) {
      stopTimer();
      // Auto-skip on timeout
      handleSubmitAnswer(null);
    }
  }, [questionTimeElapsed, timeLimit, stopTimer, handleSubmitAnswer]);

  // Handle difficulty selection and game start
  const handleStartGame = useCallback(
    (selectedDifficulty: Difficulty) => {
      const generatedQuestions = generateQuestions(selectedDifficulty);
      startGame(selectedDifficulty, generatedQuestions);
      highscoreSavedRef.current = false;
      setIsInTop5(false);
      setQuestionTimeElapsed(0);
      setTotalTimeSpent(0);
      startQuestionTimer();
    },
    [generateQuestions, startGame, startQuestionTimer]
  );

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    stopTimer();
    resetGame();
    setQuestionTimeElapsed(0);
    setTotalTimeSpent(0);
  }, [resetGame, stopTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Save highscore when game finishes
  useEffect(() => {
    if (status === 'results' && difficulty && !highscoreSavedRef.current) {
      highscoreSavedRef.current = true;
      const storageKey = createHighscoreKey('addition', difficulty.id);
      const result = addHighscore(storageKey, {
        name: playerName || 'Anonyme',
        score,
        time: totalTimeSpent,
        date: new Date().toISOString(),
      });
      setIsInTop5(result);
    }
  }, [status, difficulty, playerName, score, totalTimeSpent, addHighscore]);

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
        timeElapsed={questionTimeElapsed}
        timeLimit={timeLimit}
        isRunning={isTimerRunning}
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
      timeElapsed={totalTimeSpent}
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
            ➕ École de Magie des Additions ✨
          </h1>
          <p className="text-purple-200">
            Entraîne-toi à ajouter comme un magicien !
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
            difficulties={ADDITION_DIFFICULTIES}
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
            ➕ Addition ✨
          </h1>
        </div>

        {/* Timer - only show if there's a time limit */}
        {timeLimit > 0 && (
          <div className="mb-4">
            <Timer
              timeLimit={timeLimit}
              timeElapsed={timeElapsed}
              isRunning={isRunning}
            />
          </div>
        )}

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
          gameType="addition"
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

export default AdditionPage;
