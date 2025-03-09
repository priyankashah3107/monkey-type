"use client";
import React, { useState, useEffect } from "react";
import { Clock, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const words = [
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "that",
  "have",
  "I",
  "it",
  "for",
  "not",
  "on",
  "with",
  "he",
  "as",
  "you",
  "do",
  "at",
  "this",
  "but",
  "his",
  "by",
  "from",
  "they",
  "we",
  "say",
  "her",
  "she",
  "or",
  "an",
  "will",
  "my",
  "one",
  "all",
  "would",
  "there",
  "their",
  "what",
];

interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

function TabComponent() {
  const [mode, setMode] = useState<"time" | "word">("time");
  const [selectedValue, setSelectedValue] = useState<number>(15);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(false);
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  });

  const options = [15, 30, 60, 120];
  const KEY_PRESS_DELAY = 50;

  const generateWords = (count: number = 50) => {
    const newWords: string[] = [];
    for (let i = 0; i < count; i++) {
      newWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    return newWords;
  };

  const addMoreWords = () => {
    if (currentWordIndex > currentWords.length - 10) {
      setCurrentWords((prev) => [...prev, ...generateWords(20)]);
    }
  };

  const resetGame = () => {
    setCurrentWords(generateWords());
    setTypedText("");
    setCurrentWordIndex(0);
    setStartTime(null);
    setTimeLeft(mode === "time" ? selectedValue : Infinity);
    setIsActive(false);
    setLastKeyPressTime(0);
    setIsCompleted(false);
    setStats({
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    });
  };

  useEffect(() => {
    resetGame();
  }, [mode, selectedValue]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && mode === "time" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (mode === "time" && timeLeft === 0) {
      calculateFinalStats();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isCompleted) return;

      const currentTime = Date.now();

      if (currentTime - lastKeyPressTime < KEY_PRESS_DELAY) {
        e.preventDefault();
        return;
      }

      if (
        timeLeft === 0 ||
        (mode === "word" && currentWordIndex >= selectedValue)
      ) {
        return;
      }

      if (!isActive && e.key.length === 1) {
        setIsActive(true);
        setStartTime(Date.now());
      }

      if (e.key === "Backspace") {
        setTypedText((prev) => prev.slice(0, -1));
        setLastKeyPressTime(currentTime);
        return;
      }

      if (e.key.length === 1) {
        const newTypedText = typedText + e.key;
        const currentWord = currentWords[currentWordIndex];

        if (newTypedText.length <= currentWord.length + 1) {
          setTypedText(newTypedText);
          setLastKeyPressTime(currentTime);

          if (e.key === " ") {
            if (newTypedText.trim() === currentWord) {
              setStats((prev) => ({
                ...prev,
                correctChars: prev.correctChars + currentWord.length,
                totalChars: prev.totalChars + currentWord.length,
              }));
            }
          } else {
            const isCharCorrect =
              currentWord[newTypedText.length - 1] === e.key;
            setStats((prev) => ({
              ...prev,
              correctChars: prev.correctChars + (isCharCorrect ? 1 : 0),
              incorrectChars: prev.incorrectChars + (isCharCorrect ? 0 : 1),
              totalChars: prev.totalChars + 1,
            }));
          }

          if (e.key === " " && newTypedText.trim() === currentWord) {
            setTypedText("");
            setCurrentWordIndex((prev) => {
              if (mode === "word" && prev + 1 >= selectedValue) {
                calculateFinalStats();
                return prev;
              }
              addMoreWords();
              return prev + 1;
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    typedText,
    currentWordIndex,
    currentWords,
    isActive,
    timeLeft,
    mode,
    selectedValue,
    lastKeyPressTime,
    isCompleted,
  ]);

  const calculateFinalStats = () => {
    const timeTaken = (Date.now() - (startTime || Date.now())) / 1000;
    const minutes = timeTaken / 60;
    const totalWords = currentWordIndex;
    const wpm = Math.round(totalWords / minutes);
    const accuracy = Math.round(
      (stats.correctChars / (stats.correctChars + stats.incorrectChars)) * 100
    );

    setStats((prev) => ({
      ...prev,
      wpm,
      accuracy,
    }));
    setIsActive(false);
    setIsCompleted(true);
  };

  const renderCurrentWord = (word: string, index: number) => {
    if (index !== currentWordIndex) return word;

    return word.split("").map((char, charIndex) => {
      const typedChar = typedText[charIndex];
      if (typedChar === undefined) {
        return (
          <span key={charIndex} className="text-gray-600">
            {char}
          </span>
        );
      }
      return (
        <span
          key={charIndex}
          className={typedChar === char ? "text-white" : "text-red-500"}
        >
          {char}
        </span>
      );
    });
  };

  const getWordClassName = (index: number) => {
    if (index < currentWordIndex) return "text-gray-200";
    if (index === currentWordIndex) return "";
    return "text-gray-600";
  };

  return (
    <div className="flex flex-col items-center justify-center  p-4  text-white">
      <div className="w-full  rounded-xl p-2 ">
        <div className="flex flex-col items-center gap-6">
          <Tabs
            defaultValue="time"
            className="w-[400px] flex flex-row justify-center items-center gap-4"
          >
            <TabsList className="bg-gray-700 text-gray-100 flex flex-row justify-center items-center">
              <TabsTrigger
                value="time"
                className="flex items-center gap-1 data-[state=active]:bg-yellow-400"
                onClick={() => setMode("time")}
              >
                <Clock className="w-4 h-4" />
                Time
              </TabsTrigger>
              <TabsTrigger
                value="word"
                className="flex items-center gap-1 data-[state=active]:bg-yellow-400"
                onClick={() => setMode("word")}
              >
                <span className="font-bold">A</span>
                Words
              </TabsTrigger>
            </TabsList>
            <TabsContent value="time">
              <div className="flex gap-3 justify-center">
                {options.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedValue(time)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedValue === time
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="word">
              <div className="flex gap-3 justify-center">
                {options.map((word) => (
                  <button
                    key={word}
                    onClick={() => setSelectedValue(word)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedValue === word
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end items-center gap-4 my-6">
          {mode === "time" && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-xl font-mono text-gray-200">
                {timeLeft}s
              </span>
            </div>
          )}
          {mode === "word" && (
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono text-gray-200">
                {currentWordIndex}/{selectedValue} words
              </span>
            </div>
          )}
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {!isCompleted ? (
          <div className="relative">
            <div
              className="text-3xl  leading-relaxed mt-4 overflow-y-auto font-mono p-4 rounded-lg  focus:outline-none scrollbar-hide"
              tabIndex={0}
            >
              <div className="flex flex-wrap gap-2">
                {currentWords.map((word, index) => (
                  <span key={index} className={getWordClassName(index)}>
                    {renderCurrentWord(word, index)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 py-8">
            <h2 className="text-2xl font-bold text-yellow-400">
              Test Complete!
            </h2>
            <div className="grid grid-cols-3 gap-8 w-full max-w-2xl">
              <div className="bg-gray-700 p-6 rounded-lg text-center transform transition-all hover:scale-105">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {stats.wpm}
                </div>
                <div className="text-sm text-gray-400">Words per minute</div>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg text-center transform transition-all hover:scale-105">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {stats.accuracy}%
                </div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg text-center transform transition-all hover:scale-105">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {currentWordIndex}
                </div>
                <div className="text-sm text-gray-400">Words typed</div>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TabComponent;
