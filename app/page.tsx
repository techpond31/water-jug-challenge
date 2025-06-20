"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  RotateCcw,
  Droplets,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
        // Fill jug X
        {
          state: [x, currentY] as [number, number],
          action: `Fill jug X (${x}L capacity)`,
        },
        // Fill jug Y
        {
          state: [currentX, y] as [number, number],
          action: `Fill jug Y (${y}L capacity)`,
        },
        // Empty jug X
        { state: [0, currentY] as [number, number], action: "Empty jug X" },
        // Empty jug Y
        { state: [currentX, 0] as [number, number], action: "Empty jug Y" },
        // Transfer X to Y
        {
          state: [
            Math.max(0, currentX - (y - currentY)),
            Math.min(y, currentY + currentX),
          ] as [number, number],
          action: "Transfer from jug X to jug Y",
        },
        // Transfer Y to X
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

  const handleSolve = async () => {
    if (jugX <= 0 || jugY <= 0 || target <= 0) {
      setSolution({
        steps: [],
        possible: false,
        message: "All values must be positive integers greater than 0.",
      });
      return;
    }

    setIsLoading(true);
    setCurrentStep(0);

    // Add a small delay to show loading state
    setTimeout(() => {
      const result = solvePuzzle(jugX, jugY, target);
      setSolution(result);
      setIsLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setSolution(null);
    setCurrentStep(0);
  };

  const getJugFillPercentage = (current: number, capacity: number) => {
    return (current / capacity) * 100;
  };

  const getJugStatus = (current: number, capacity: number) => {
    if (current === 0) return "Empty";
    if (current === capacity) return "Full";
    return "Partially Full";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Droplets className="text-blue-500" />
            Water Jug Challenge
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Solve the classic water jug riddle! Use two jugs with different
            capacities to measure an exact amount of water.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Setup</CardTitle>
              <CardDescription>
                Enter the capacities of both jugs and the target amount to
                measure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jugX">Jug X Capacity</Label>
                  <Input
                    id="jugX"
                    type="number"
                    min="1"
                    value={jugX}
                    onChange={(e) =>
                      setJugX(Number.parseInt(e.target.value) || 0)
                    }
                    placeholder="e.g., 2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jugY">Jug Y Capacity</Label>
                  <Input
                    id="jugY"
                    type="number"
                    min="1"
                    value={jugY}
                    onChange={(e) =>
                      setJugY(Number.parseInt(e.target.value) || 0)
                    }
                    placeholder="e.g., 10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target Amount</Label>
                  <Input
                    id="target"
                    type="number"
                    min="1"
                    value={target}
                    onChange={(e) =>
                      setTarget(Number.parseInt(e.target.value) || 0)
                    }
                    placeholder="e.g., 4"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSolve}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Solving...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Solve Puzzle
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Quick Examples */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Examples:</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setJugX(2);
                      setJugY(10);
                      setTarget(4);
                    }}
                  >
                    2, 10 → 4
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setJugX(2);
                      setJugY(100);
                      setTarget(96);
                    }}
                  >
                    2, 100 → 96
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setJugX(2);
                      setJugY(6);
                      setTarget(5);
                    }}
                  >
                    2, 6 → 5 (No Solution)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current State Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Current State</CardTitle>
              <CardDescription>
                Visual representation of both jugs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solution && solution.possible && solution.steps.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Step {currentStep + 1} of {solution.steps.length}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentStep(Math.max(0, currentStep - 1))
                        }
                        disabled={currentStep === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentStep(
                            Math.min(solution.steps.length - 1, currentStep + 1)
                          )
                        }
                        disabled={currentStep === solution.steps.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Jug X */}
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Jug X ({jugX}L)</h3>
                      <div className="relative w-20 h-32 mx-auto border-2 border-gray-400 rounded-b-lg bg-gray-50">
                        <div
                          className="absolute bottom-0 w-full bg-blue-400 rounded-b-lg transition-all duration-500"
                          style={{
                            height: `${getJugFillPercentage(
                              solution.steps[currentStep].jugX,
                              jugX
                            )}%`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                          {solution.steps[currentStep].jugX}L
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {getJugStatus(solution.steps[currentStep].jugX, jugX)}
                      </Badge>
                    </div>

                    {/* Jug Y */}
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Jug Y ({jugY}L)</h3>
                      <div className="relative w-20 h-32 mx-auto border-2 border-gray-400 rounded-b-lg bg-gray-50">
                        <div
                          className="absolute bottom-0 w-full bg-blue-400 rounded-b-lg transition-all duration-500"
                          style={{
                            height: `${getJugFillPercentage(
                              solution.steps[currentStep].jugY,
                              jugY
                            )}%`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                          {solution.steps[currentStep].jugY}L
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {getJugStatus(solution.steps[currentStep].jugY, jugY)}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      {solution.steps[currentStep].action}
                    </p>
                  </div>

                  {(solution.steps[currentStep].jugX === target ||
                    solution.steps[currentStep].jugY === target) && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Solution Found!</strong> Target amount of{" "}
                        {target}L achieved in {currentStep + 1} steps.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Droplets className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>
                    Enter values and click "Solve Puzzle" to see the
                    visualization
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Solution Steps */}
        {solution && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {solution.possible ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                Solution Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {solution.possible ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-green-600 font-medium">
                      Solution found in {solution.steps.length} steps!
                    </p>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      Optimal Solution
                    </Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Step</th>
                          <th className="text-left p-2 font-medium">
                            Jug X ({jugX}L)
                          </th>
                          <th className="text-left p-2 font-medium">
                            Jug Y ({jugY}L)
                          </th>
                          <th className="text-left p-2 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solution.steps.map((step, index) => (
                          <tr
                            key={index}
                            className={`border-b hover:bg-gray-50 ${
                              index === currentStep
                                ? "bg-blue-50 border-blue-200"
                                : ""
                            } ${
                              step.jugX === target || step.jugY === target
                                ? "bg-green-50"
                                : ""
                            }`}
                          >
                            <td className="p-2 font-mono">{index}</td>
                            <td className="p-2 font-mono text-center">
                              <Badge
                                variant={
                                  step.jugX === target ? "default" : "secondary"
                                }
                              >
                                {step.jugX}
                              </Badge>
                            </td>
                            <td className="p-2 font-mono text-center">
                              <Badge
                                variant={
                                  step.jugY === target ? "default" : "secondary"
                                }
                              >
                                {step.jugY}
                              </Badge>
                            </td>
                            <td className="p-2 text-sm">{step.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>No Solution:</strong> {solution.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Algorithm Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Understanding the mathematical theory behind the solution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Mathematical Theory</h4>
                <p className="text-sm text-gray-600">
                  A solution exists if and only if the target amount Z is
                  divisible by the Greatest Common Divisor (GCD) of the two jug
                  capacities X and Y.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Algorithm</h4>
                <p className="text-sm text-gray-600">
                  We use Breadth-First Search (BFS) to find the shortest
                  sequence of operations that leads to the target amount.
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">Allowed Operations</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <Badge variant="outline">Fill Jug X</Badge>
                <Badge variant="outline">Fill Jug Y</Badge>
                <Badge variant="outline">Empty Jug X</Badge>
                <Badge variant="outline">Empty Jug Y</Badge>
                <Badge variant="outline">Transfer X → Y</Badge>
                <Badge variant="outline">Transfer Y → X</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
