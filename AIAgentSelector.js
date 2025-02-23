import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Settings,
  Calculator,
  ShieldCheck,
  Users,
  Target,
  Leaf,
  ShoppingCart,
  Building2,
  Moon,
  Sun
} from 'lucide-react';

// Onboarding library (optional): npm install react-joyride
import Joyride, { STATUS } from 'react-joyride';

// Charts library: npm install recharts
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

// Debounce function for real-time suggestions
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export default function AIAgentSelector() {
  // 1) We'll allow multiple agents
  const [selectedAgents, setSelectedAgents] = useState([]);

  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]); // For real-time AI suggestions

  const [showWelcome, setShowWelcome] = useState(true);
  const [showMoreAgents, setShowMoreAgents] = useState(false);
  const [showMoreQuestions, setShowMoreQuestions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSubAgentsCost, setShowSubAgentsCost] = useState(false);

  // Onboarding steps (Joyride)
  const [runJoyride, setRunJoyride] = useState(false);
  const joyrideSteps = [
    {
      target: '#brand-header',
      content: 'Welcome to the Epic AI Bidding Assistant!'
    },
    {
      target: '#question-input',
      content: 'Type your question here!'
    },
    {
      target: '#agent-section',
      content: 'Pick an agent to solve different tasks!'
    },
    {
      target: '#featured-questions',
      content: 'Click these to auto-select an agent and ask a relevant question!'
    }
  ];

  // Suggestions
  const baseSuggestions = [
    'How to optimize bid pricing?',
    'Review sustainability requirements',
    'Generate cost estimation report',
    'Analyze competitor bids'
  ];

  // Agents
  const agents = [
    { id: 'search', name: 'Search Agent', icon: <Search className="w-6 h-6 text-rose-500" /> },
    { id: 'technical', name: 'Technical Validation Agent', icon: <Settings className="w-6 h-6 text-purple-500" /> },
    {
      id: 'cost',
      name: 'Cost Estimation Agent',
      icon: <Calculator className="w-6 h-6 text-blue-500" />,
      subAgents: [
        { id: 'labor', name: 'Labor Sub-Agent' },
        { id: 'materials', name: 'Materials Sub-Agent' },
        { id: 'subcontractors', name: 'Subcontractors Sub-Agent' }
      ]
    },
    { id: 'compliance', name: 'Compliance Agent', icon: <ShieldCheck className="w-6 h-6 text-pink-500" /> },
    { id: 'humanisation', name: 'Humanisation Agent', icon: <Users className="w-6 h-6 text-blue-400" /> },
    { id: 'strategy', name: 'Bid Strategy Agent', icon: <Target className="w-6 h-6 text-cyan-500" /> },
    { id: 'sustainability', name: 'Sustainability Agent', icon: <Leaf className="w-6 h-6 text-green-500" /> },
    { id: 'procurement', name: 'Procurement Agent', icon: <ShoppingCart className="w-6 h-6 text-orange-500" /> },
    { id: 'business', name: 'Business Support Agent', icon: <Building2 className="w-6 h-6 text-purple-500" /> },
    { id: 'innovation', name: 'Innovation Agent', icon: <Settings className="w-6 h-6 text-teal-500" /> },
    { id: 'analytics', name: 'Analytics Agent', icon: <Calculator className="w-6 h-6 text-indigo-500" /> }
  ];

  // For demonstration, we can define some featured questions that choose multiple agents.
  // We'll store categories as an array for multi-agent selection.
  const featuredQuestions = [
    {
      id: 1,
      text: 'What local building regulations must we comply with?',
      categories: ['Compliance Agent']
    },
    {
      id: 2,
      text: 'Review structural design for best practices',
      categories: ['Technical Validation Agent']
    },
    {
      id: 3,
      text: 'Provide a cost model for a 50-story building project',
      categories: ['Cost Estimation Agent']
    },
    {
      id: 4,
      text: 'How to reduce carbon footprint in the design?',
      categories: ['Sustainability Agent']
    },
    {
      id: 5,
      text: 'Develop a winning strategy for a municipal waste facility bid',
      categories: ['Bid Strategy Agent']
    },
    {
      id: 6,
      text: 'Analyze raw material procurement pipeline',
      categories: ['Procurement Agent']
    },
    {
      id: 7,
      text: 'Scout available tender listings for infrastructure projects',
      categories: ['Search Agent']
    },
    {
      id: 8,
      text: 'Evaluate compliance and cost for a new hospital project',
      // Example of multi-select: pick compliance + cost.
      categories: ['Compliance Agent', 'Cost Estimation Agent']
    }
  ];

  // For the scenario: "4 agents completed tasks in 3 minutes..." We'll bring back Pie.
  // Suppose each agent completed some fraction.
  const scenarioData = [
    { name: 'Search Agent', value: 2 },
    { name: 'Cost Agent', value: 3 },
    { name: 'Compliance Agent', value: 2 },
    { name: 'Strategy Agent', value: 4 }
  ];
  const scenarioColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Handle question submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Attempt an adaptive agent recommendation based on key terms.
    const recommendedAgent = autoRecommendAgent(question);
    if (recommendedAgent) {
      // We'll add that agent to the selectedAgents array if not present.
      toggleAgentSelection(recommendedAgent);
    }

    // Simulate loading
    setTimeout(() => {
      console.log('Selected Agents:', selectedAgents);
      console.log('Question:', question);
      setIsLoading(false);
    }, 1200);
  };

  // Toggle agent in selectedAgents array
  function toggleAgentSelection(agentId) {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) {
        // remove it
        return prev.filter((id) => id !== agentId);
      } else {
        // add it
        return [...prev, agentId];
      }
    });
  }

  // Debounced AI suggestions
  const fetchAISuggestions = debounce(async (input) => {
    if (!input) {
      setAISuggestions([]);
      return;
    }
    setIsLoading(true);
    // Simulate an async call to an LLM
    setTimeout(() => {
      // Combine base suggestions + pretend AI returns variations
      const dynamic = [
        `AI suggestion for: ${input} #1`,
        `AI suggestion for: ${input} #2`
      ];
      setAISuggestions(dynamic);
      setIsLoading(false);
    }, 1000);
  }, 500);

  // Listen for question changes
  useEffect(() => {
    fetchAISuggestions(question);
  }, [question]);

  // Dark mode from localStorage or default
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('epicDarkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('epicDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Joyride callback
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunJoyride(false);
    }
  };

  // Simple keyword-based recommendation
  function autoRecommendAgent(input) {
    const lower = input.toLowerCase();
    if (lower.includes('cost') || lower.includes('price') || lower.includes('model')) {
      return 'cost';
    } else if (lower.includes('sustain') || lower.includes('carbon') || lower.includes('green')) {
      return 'sustainability';
    } else if (lower.includes('compliance') || lower.includes('regulation') || lower.includes('law')) {
      return 'compliance';
    } else if (lower.includes('technical') || lower.includes('design') || lower.includes('validate')) {
      return 'technical';
    } else if (lower.includes('strategy') || lower.includes('bid') || lower.includes('competitive')) {
      return 'strategy';
    }
    return null;
  }

  const containerClass = darkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-tr from-blue-50 via-purple-50 to-blue-50 text-gray-700';

  // Combine suggestions
  const combinedSuggestions = [...baseSuggestions, ...aiSuggestions];

  // See if an agent is selected
  function isAgentSelected(agentId) {
    return selectedAgents.includes(agentId);
  }

  // Handle multi-agent from featured question
  function handleFeaturedQuestionClick(item) {
    // auto-set the question text
    setQuestion(item.text);

    // Convert each category to agent ID, then add those IDs to selectedAgents
    const matchedAgentIds = agents
      .filter((a) => item.categories.includes(a.name))
      .map((a) => a.id);

    // For each matched ID, toggle it on if not already selected.
    setSelectedAgents((prev) => {
      // remove duplicates
      const newSet = new Set(prev);
      matchedAgentIds.forEach((id) => {
        newSet.add(id);
      });
      return Array.from(newSet);
    });
  }

  return (
    <div className={`min-h-screen w-full p-4 transition-colors duration-300 ${containerClass}`}>
      {/* Joyride for Onboarding */}
      <Joyride
        steps={joyrideSteps}
        run={runJoyride}
        continuous
        scrollToFirstStep
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
          }
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Brand Header */}
        <div id="brand-header" className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">C</span>
            </div>
            <div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Contoso - AI Powered</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Intelligent Construction Bidding Assistant</div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200">
              <Settings className={darkMode ? 'w-5 h-5 text-gray-300' : 'w-5 h-5 text-gray-500'} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200">
              <MessageSquare className={darkMode ? 'w-5 h-5 text-gray-300' : 'w-5 h-5 text-gray-500'} />
            </button>
            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </button>
            {/* Start Joyride Button */}
            <button
              onClick={() => setRunJoyride(true)}
              className={`p-2 rounded-full transition-all duration-200 ${darkMode ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-600'}`}
            >
              Guide
            </button>
          </div>
        </div>

        {/* Simple Placeholder Example */}
        <div className={`p-4 rounded-lg shadow-md flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col items-center">
            <MessageSquare className="w-12 h-12 text-blue-500" />
            <p className="mt-2 text-sm">
              A simple placeholder component.
            </p>
          </div>
        </div>

        {/* Welcome Message */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={`${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white p-4 rounded-lg flex items-center space-x-2 shadow-md`}
            >
              <MessageSquare className="w-6 h-6" />
              <div>
                <p className="text-sm">Ask me any question or select from the categories below.</p>
              </div>
              <button className="ml-auto" onClick={() => setShowWelcome(false)}>
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Input + AI Suggestions */}
        <form onSubmit={handleSubmit} className="relative" id="question-input">
          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            type="text"
            className={`w-full p-4 pl-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-colors duration-300 
              ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            placeholder="Ask Anything"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
          />
          <Search
            className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors 
              ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}
          />

          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
            </div>
          )}

          {/* Auto-complete suggestions (static + AI) */}
          <AnimatePresence>
            {showSuggestions && combinedSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`absolute w-full mt-1 rounded-lg border shadow-lg z-10 transition-colors 
                  ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                {combinedSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors 
                      ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    onClick={() => {
                      setQuestion(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Agent Selection (multiple) */}
        <div id="agent-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Select Agents</h2>
            <button
              type="button"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700"
              onClick={() => setShowMoreAgents(!showMoreAgents)}
            >
              {showMoreAgents ? 'Show Less' : 'Show More'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {agents.slice(0, showMoreAgents ? agents.length : 9).map((agent) => {
              // dynamic border for dark vs. light + multi select
              const isSelected = isAgentSelected(agent.id);
              const borderColor = isSelected
                ? 'border-blue-500'
                : darkMode
                ? 'border-gray-700 hover:border-blue-500'
                : 'border-gray-200 hover:border-blue-300';

              const bgColor = isSelected
                ? (darkMode ? 'bg-blue-900' : 'bg-blue-50')
                : (darkMode ? 'bg-gray-800' : 'bg-white');

              return (
                <motion.div
                  key={agent.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleAgentSelection(agent.id)}
                  className={`p-4 rounded-lg border relative group transition-all duration-300 shadow-sm flex flex-col space-y-3 cursor-pointer 
                    ${borderColor} ${bgColor}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">{agent.icon}</div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{agent.name}</span>
                  </div>
                  {/* For cost agent, a sub-agent demonstration */}
                  {agent.id === 'cost' && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAgentSelection('cost');
                          setShowSubAgentsCost(!showSubAgentsCost);
                        }}
                        className="text-xs text-blue-500 dark:text-blue-400 underline text-left"
                      >
                        {showSubAgentsCost ? 'Hide Sub-Agents' : 'Show Sub-Agents'}
                      </button>
                      <AnimatePresence>
                        {showSubAgentsCost && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs space-y-1 mt-2"
                          >
                            {agent.subAgents?.map((sub) => (
                              <div key={sub.id} className="pl-4">
                                • {sub.name}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {agent.id === 'technical' && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      New
                    </span>
                  )}
                  {agent.id === 'strategy' && (
                    <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      Popular
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Featured Questions */}
        <div id="featured-questions">
          <div className="flex justify-between items-center mb-4 mt-8">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Featured Questions</h2>
            <button
              type="button"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700"
              onClick={() => setShowMoreQuestions(!showMoreQuestions)}
            >
              {showMoreQuestions ? 'Show Less' : 'Show More'}
            </button>
          </div>
          <div className="space-y-2">
            {featuredQuestions.slice(0, showMoreQuestions ? featuredQuestions.length : 4).map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 text-left rounded-lg border transition-colors shadow-sm 
                  ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500 text-gray-200' : 'bg-white border-gray-200 hover:border-blue-300 text-gray-700'}`}
                onClick={() => handleFeaturedQuestionClick(item)}
              >
                <p className="font-medium">{item.text}</p>
                {/* If you want to show multiple categories, join them with &. */}
                <p className="text-sm mt-1 opacity-80">{item.categories.join(' & ')}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* PieChart with the scenario text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border border-gray-200 text-gray-800'} mt-8 p-4 rounded-lg shadow-sm`}
        >
          <h3 className="text-lg font-semibold mb-2">Recent Workflow Completion</h3>
          <p className="text-sm mb-4">4 agents completed tasks in about 3 minutes to finalize the documentation draft.</p>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={scenarioData}
                  dataKey="value"
                  nameKey="name"
                  label
                  outerRadius="70%"
                >
                  {scenarioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={scenarioColors[index % scenarioColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
