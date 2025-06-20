# Water Jug Challenge

A React-based application that solves the classic Water Jug Riddle using an optimal algorithm and provides an intuitive user interface to visualize the solution step-by-step.

## Overview

The Water Jug Challenge involves using two jugs with different capacities (X gallons and Y gallons) to measure exactly Z gallons of water. This application finds the most efficient solution and displays each step with visual representations of the jug states.

## Features

- **Interactive UI**: Input any values for jug capacities and target amount
- **Step-by-step Visualization**: See the state of both jugs at each step
- **Optimal Solution**: Uses BFS algorithm to find the shortest solution path
- **Visual Jug Representation**: Animated jug filling/emptying with status indicators
- **Error Handling**: Detects impossible scenarios and provides clear feedback
- **Quick Examples**: Pre-loaded test cases for immediate testing
- **Responsive Design**: Works on desktop and mobile devices

## Mathematical Theory

### Solution Existence

A solution exists if and only if the target amount Z is divisible by the Greatest Common Divisor (GCD) of the two jug capacities X and Y.

**Formula**: `Z % GCD(X, Y) == 0`

### Algorithm

The application uses **Breadth-First Search (BFS)** to find the optimal (shortest) solution:

1. Start with both jugs empty (0, 0)
2. Generate all possible next states using allowed operations
3. Track visited states to avoid cycles
4. Continue until target amount is found in either jug
5. Return the path of operations that led to the solution

### Allowed Operations

1. **Fill Jug X**: Fill jug X to its maximum capacity
2. **Fill Jug Y**: Fill jug Y to its maximum capacity
3. **Empty Jug X**: Empty jug X completely
4. **Empty Jug Y**: Empty jug Y completely
5. **Transfer X → Y**: Pour from jug X to jug Y until X is empty or Y is full
6. **Transfer Y → X**: Pour from jug Y to jug X until Y is empty or X is full

## Installation & Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/techpond31/water-jug-challenge.git
   cd water-jug-challenge
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to \`http://localhost:3000\` to use the application

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Usage Instructions

1. **Enter Jug Capacities**: Input the maximum capacity for Jug X and Jug Y
2. **Set Target Amount**: Enter the exact amount of water you want to measure
3. **Solve**: Click the "Solve Puzzle" button to find the solution
4. **Navigate Steps**: Use Previous/Next buttons to step through the solution
5. **Visual Feedback**: Watch the animated jugs fill and empty at each step

### Quick Examples

The application includes pre-loaded examples:

- **2, 10 → 4**: Basic example with clear solution
- **2, 100 → 96**: Larger numbers demonstrating efficiency
- **2, 6 → 5**: Example with no possible solution

## Test Cases for Validation

### Test Case 1: Basic Solution

- **Input**: Jug X = 2L, Jug Y = 10L, Target = 4L
- **Expected**: Solution in 4 steps
- **Steps**: Fill X → Transfer X→Y → Fill X → Transfer X→Y
- **Result**: Jug Y contains 4L

### Test Case 2: Large Numbers

- **Input**: Jug X = 2L, Jug Y = 100L, Target = 96L
- **Expected**: Solution in 4 steps
- **Steps**: Fill Y → Transfer Y→X → Empty X → Transfer Y→X
- **Result**: Jug Y contains 96L

### Test Case 3: No Solution

- **Input**: Jug X = 2L, Jug Y = 6L, Target = 5L
- **Expected**: "No Solution" message
- **Reason**: GCD(2,6) = 2, and 5 % 2 ≠ 0

### Test Case 4: Target Equals Capacity

- **Input**: Jug X = 3L, Jug Y = 5L, Target = 5L
- **Expected**: Solution in 1 step
- **Steps**: Fill Y
- **Result**: Jug Y contains 5L

### Test Case 5: Complex Solution

- **Input**: Jug X = 3L, Jug Y = 5L, Target = 4L
- **Expected**: Solution in 6 steps
- **Mathematical verification**: GCD(3,5) = 1, and 4 % 1 = 0 ✓

## Technical Implementation

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Next.js 14
- **Algorithm**: Breadth-First Search (BFS)

### Key Components

- **State Management**: React hooks for managing jug states and solution steps
- **Algorithm Engine**: Pure JavaScript implementation of BFS water jug solver
- **UI Components**: Reusable components for inputs, visualization, and results
- **Animation**: CSS transitions for smooth jug filling/emptying effects

### Code Organization

\`\`\`
src/
├── app/
│ ├── page.tsx # Main application component
│ ├── layout.tsx # Root layout
│ └── globals.css # Global styles
├── components/ui/ # Reusable UI components
└── README.md # This documentation
\`\`\`

## Algorithm Complexity

- **Time Complexity**: O(X × Y) where X and Y are jug capacities
- **Space Complexity**: O(X × Y) for storing visited states
- **Optimality**: BFS guarantees the shortest solution path

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/improvement\`)
3. Commit your changes (\`git commit -am 'Add new feature'\`)
4. Push to the branch (\`git push origin feature/improvement\`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Classic Water Jug Riddle mathematical foundation
- BFS algorithm for optimal pathfinding
- React and Next.js communities for excellent tooling
