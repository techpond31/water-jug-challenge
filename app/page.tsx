"use client";

import { useState } from "react";

interface Step {
  jugX: number;
  jugY: number;
  action: string;
  stepNumber: number;
}

interface Solution {
  steps: Step[];
  possible: boolean;
  message?: string;
}

export default function WaterJugChallenge() {
  const [jugX, setJugX] = useState<number>(2);
  const [jugY, setJugY] = useState<number>(10);
  const [target, setTarget] = useState<number>(4);
  const [solution, setSolution] = useState<Solution | null>(null);

  // GCD function
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // Check if solution is possible
  const isSolutionPossible = (x: number, y: number, z: number): boolean => {
    if (z > Math.max(x, y)) return false;
    return z % gcd(x, y) === 0;
  };

  // BFS to find the shortest solution
  const solvePuzzle = (x: number, y: number, z: number): Solution => {
    if (!isSolutionPossible(x, y, z)) {
      return {
        steps: [],
        possible: false,
        message:
          "No solution possible. The target amount cannot be measured with these jug capacities.",
      };
    }

    if (z === 0) {
      return {
        steps: [
          {
            jugX: 0,
            jugY: 0,
            action: "Initial state - both jugs empty",
            stepNumber: 0,
          },
        ],
        possible: true,
      };
    }

    const visited = new Set<string>();
    const queue: Array<{ state: [number, number]; path: Step[] }> = [];

    queue.push({
      state: [0, 0],
      path: [
        {
          jugX: 0,
          jugY: 0,
          action: "Initial state - both jugs empty",
          stepNumber: 0,
        },
      ],
    });
    visited.add("0,0");

    while (queue.length > 0) {
      const {
        state: [currentX, currentY],
        path,
      } = queue.shift()!;

      if (currentX === z || currentY === z) {
        return { steps: path, possible: true };
      }

      // All possible next states
      const nextStates = [
        {
          state: [x, currentY] as [number, number],
          action: `Fill jug X (${x}L capacity)`,
        },
        {
          state: [currentX, y] as [number, number],
          action: `Fill jug Y (${y}L capacity)`,
        },
        { state: [0, currentY] as [number, number], action: "Empty jug X" },
        { state: [currentX, 0] as [number, number], action: "Empty jug Y" },
        {
          state: [
            Math.max(0, currentX - (y - currentY)),
            Math.min(y, currentY + currentX),
          ] as [number, number],
          action: "Transfer from jug X to jug Y",
        },
        {
          state: [
            Math.min(x, currentX + currentY),
            Math.max(0, currentY - (x - currentX)),
          ] as [number, number],
          action: "Transfer from jug Y to jug X",
        },
      ];

      for (const { state: nextState, action } of nextStates) {
        const stateKey = `${nextState[0]},${nextState[1]}`;

        if (!visited.has(stateKey)) {
          visited.add(stateKey);
          const newPath = [
            ...path,
            {
              jugX: nextState[0],
              jugY: nextState[1],
              action,
              stepNumber: path.length,
            },
          ];
          queue.push({ state: nextState, path: newPath });
        }
      }
    }

    return {
      steps: [],
      possible: false,
      message: "No solution found.",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Water Jug Challenge
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Solve the classic water jug riddle! Use two jugs with different
            capacities to measure an exact amount of water.
          </p>
        </div>

        <div className="text-center py-8 text-gray-500">
          <p>Algorithm implemented - UI coming next!</p>
        </div>
      </div>
    </div>
  );
}
