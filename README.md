# Epic AI Bidding Assistant - Proof of Concept- Multi-Agent AI Suggester
=============================================

[![GitHub Stars](https://img.shields.io/github/stars/ITSpecialist111/Copilot-Agent-Suggester?style=social)](https://github.com/ITSpecialist111/Copilot-Agent-Suggester/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/ITSpecialist111/Copilot-Agent-Suggester?style=social)](https://github.com/ITSpecialist111/Copilot-Agent-Suggester/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/ITSpecialist111/Copilot-Agent-Suggester)](https://github.com/ITSpecialist111/Copilot-Agent-Suggester/issues)
[![GitHub License](https://img.shields.io/github/license/ITSpecialist111/Copilot-Agent-Suggester)](https://github.com/ITSpecialist111/Copilot-Agent-Suggester/blob/main/LICENSE)

## Table of Contents

*   [Overview](#overview)
*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Installation](#installation)
*   [Usage](#usage)
*   [Project Structure](#project-structure)
*   [Dependencies](#dependencies)
*   [Future Enhancements](#future-enhancements)
*   [Contributing](#contributing)
*   [License](#license)

## Overview

This React-based project is a proof of concept for an innovative user interface designed to streamline interactions with AI agents, particularly Copilot Studio Agents, in the context of construction bidding. The goal is to provide an intuitive and efficient way to select and engage agents tailored to specific tasks, paving the way for agentic AI and Multi-Agent Workflows.

![image](https://github.com/user-attachments/assets/5a64ef4b-643f-472d-a28e-3b2c446af608)


## Features

*   **Agent Selection:** Easily browse and select AI agents based on their capabilities.
*   **Intelligent Suggestions:** Get real-time AI-powered suggestions as you type your questions.
*   **Featured Questions:** Quickly access pre-defined questions that automatically select relevant agents.
*   **Dark Mode:** Toggle between light and dark themes for optimal viewing experience.
*   **Onboarding Guide:** Interactive tutorial to guide new users through the interface.
*   **Multi-Agent Support:** Assign multiple agents to a single task for collaborative problem-solving.
*   **Dynamic UI:** Smooth animations and transitions using Framer Motion.
*   **Cost Breakdown:** Sub-Agent Cost and Material breakdown for detailed cost analysis.
*   **Workflow Visualization:** Pie chart visualizing agent workload and completion rates.

## Technologies Used

*   **React**
*   **Framer Motion** (motion and animation library)
*   **Lucide React** (set of beautiful and consistent icons)
*   **react-joyride** (library for creating interactive onboarding experiences)
*   **recharts** (library for creating composable charting components)
*   **Tailwind CSS** (framework for styling the UI)

## Installation

1.  Clone the repository:
    ```bash
git clone https://github.com/ITSpecialist111/Copilot-Agent-Suggester.git
```

2.  Install dependencies:
    ```bash
npm install
```

3.  Start the development server:
    ```bash
npm start
```

## Usage

1.  Enter your question in the search input field.
2.  Select the appropriate AI agents from the available options.
3.  Click on a featured question to automatically populate the search field and select relevant agents.
4.  Observe the pie chart to see the recent workflow completion.

## Project Structure
```bash
├── public/
├── src/
│   ├── components/
│   │   ├── AIAgentSelector.js   # Main component
│   ├── App.js                # Root component
│   ├── index.js              # Entry point
│   └── ...
├── package.json
├── README.md
└── ...
```

## Dependencies

*   `react`
*   `framer-motion`
*   `lucide-react`
*   `react-joyride`
*   `recharts`
*   `tailwindcss`

## Future Enhancements

*   Integration with actual Copilot Studio Agents or other AI platforms.
*   More sophisticated agent recommendation algorithm.
*   Enhanced UI for managing and monitoring multi-agent workflows.
*   Implementation of user authentication and authorization.
*   Implement backend for persistence of user preferences
*   Integrate with actual AI services like Azure OpenAI

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues on the [GitHub repository](https://github.com/ITSpecialist111/Copilot-Agent-Suggester).

## License

[MIT License](LICENSE)
```
