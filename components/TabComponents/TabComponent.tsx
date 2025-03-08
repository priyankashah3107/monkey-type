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
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  });

  const options = [15, 30, 60, 120];

  const generateWords = () => {
    const newWords: string[] = [];
    for (let i = 0; i < (mode === "word" ? selectedValue : 50); i++) {
      newWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    return newWords;
  };

  const resetGame = () => {
    setCurrentWords(generateWords());
    setTypedText("");
    setCurrentWordIndex(0);
    setStartTime(null);
    setTimeLeft(mode === "time" ? selectedValue : Infinity);
    setIsActive(false);
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
        return;
      }

      if (e.key.length === 1) {
        const newTypedText = typedText + e.key;
        setTypedText(newTypedText);

        const currentWord = currentWords[currentWordIndex];
        const wordToCompare = currentWord.slice(0, newTypedText.length);

        if (newTypedText === wordToCompare) {
          setStats((prev) => ({
            ...prev,
            correctChars: prev.correctChars + 1,
            totalChars: prev.totalChars + 1,
          }));
        } else {
          setStats((prev) => ({
            ...prev,
            incorrectChars: prev.incorrectChars + 1,
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
            return prev + 1;
          });
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
  };

  const getWordClassName = (index: number, word: string) => {
    if (index < currentWordIndex) return "text-gray-400"; // completed words
    if (index === currentWordIndex) {
      const isCorrect = word.startsWith(typedText);
      return isCorrect ? "text-white" : "text-red-500";
    }
    return "text-gray-600"; // upcoming words
  };

  const renderCurrentWord = (word: string, index: number) => {
    if (index !== currentWordIndex) return word;

    return (
      <>
        <span
          className={word.startsWith(typedText) ? "text-white" : "text-red-500"}
        >
          {word.slice(0, typedText.length)}
        </span>
        <span className="text-gray-600">{word.slice(typedText.length)}</span>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center gap-6 mb-8">
          <Tabs
            defaultValue="time"
            className="w-[400px] flex flex-row justify-center items-center gap-4"
          >
            <TabsList className="bg-gray-700 text-gray-100 flex flex-row justify-center items-center">
              <TabsTrigger
                value="time"
                className="flex items-center gap-1 text-gray-100 data-[state=active]:bg-blue-500"
                onClick={() => setMode("time")}
              >
                <Clock className="w-4 h-4" />
                Time
              </TabsTrigger>
              <TabsTrigger
                value="word"
                className="flex items-center gap-1 data-[state=active]:bg-green-500"
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
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {time}s
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
                        ? "bg-green-500 text-white"
                        : " text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end items-center gap-4 mb-4">
          {mode === "time" && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-xl font-mono">{timeLeft}s</span>
            </div>
          )}
          {mode === "word" && (
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono">
                {currentWordIndex}/{selectedValue} words
              </span>
            </div>
          )}
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="mb-8">
          <div
            className="text-lg leading-relaxed h-32 overflow-y-auto mb-4 font-mono bg-gray-800 p-4 rounded-lg focus:outline-none cursor-text"
            tabIndex={0}
          >
            <div className="flex flex-wrap gap-2 ">
              {currentWords.map((word, index) => (
                <span
                  key={index}
                  className={`${getWordClassName(index, word)}`}
                >
                  {renderCurrentWord(word, index)}
                  {/* this is render the word */}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.wpm}</div>
            <div className="text-sm text-gray-400">Words per minute</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400">
              {stats.accuracy}%
            </div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-400">
              {currentWordIndex}
            </div>
            <div className="text-sm text-gray-400">Words typed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabComponent;
