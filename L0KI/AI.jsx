import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, AlertCircle, Sparkles } from 'lucide-react';

/**
 * LOK|A| - Multi-Model AI Intelligence Platform
 * Enhanced version with improved API connectivity and professional formatting
 */
const MultiAIChatbot = () => {
    // State Management
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('claude');
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // AI Model Configurations
    // NOTE: Replace these with your actual API keys or use environment variables
    // For React: process.env.REACT_APP_CLAUDE_API_KEY
    // For security, use a backend proxy in production
    const models = {
        claude: {
            name: 'Claude AI ❋',
            displayIcon: 'text',
            endpoint: 'https://api.anthropic.com/v1/messages',
            color: 'bg-amber-600',
            apiKey: process.env.REACT_APP_CLAUDE_API_KEY || 'your-claude-api-key-here',
            modelVersion: 'claude-3-5-sonnet-20241022'
        },
        openai: {
            name: 'ChatGPT ֎',
            displayIcon: 'text',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            color: 'bg-green-600',
            apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'your-openai-api-key-here',
            modelVersion: 'gpt-4'
        },
        gemini: {
            name: 'Gemini ✦',
            displayIcon: 'text',
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            color: 'bg-blue-600',
            apiKey: process.env.REACT_APP_GEMINI_API_KEY || 'your-gemini-api-key-here'
        }
    };

    /**
     * Handles Claude API requests
     */
    const callClaudeAPI = async (userInput, conversationHistory) => {
        const model = models.claude;
        const messages = [
            ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userInput }
        ];

        const response = await fetch(model.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': model.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model.modelVersion,
                max_tokens: 4096,
                messages: messages
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Claude API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        if (!data.content?.[0]?.text) {
            throw new Error('Invalid response format from Claude API');
        }

        return data.content[0].text;
    };

    /**
     * Handles OpenAI API requests
     */
    const callOpenAIAPI = async (userInput, conversationHistory) => {
        const model = models.openai;
        const messages = [
            ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userInput }
        ];

        const response = await fetch(model.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${model.apiKey}`
            },
            body: JSON.stringify({
                model: model.modelVersion,
                messages: messages,
                max_tokens: 4096,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: { message: `HTTP ${response.status}: ${response.statusText}` }
            }));
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response format from OpenAI API');
        }

        return data.choices[0].message.content;
    };

    /**
     * Handles Gemini API requests
     */
    const callGeminiAPI = async (userInput, conversationHistory) => {
        const model = models.gemini;
        const contents = [
            ...conversationHistory.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            { role: 'user', parts: [{ text: userInput }] }
        ];

        const response = await fetch(`${model.endpoint}?key=${model.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    maxOutputTokens: 4096,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: { message: `HTTP ${response.status}: ${response.statusText}` }
            }));
            throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response format from Gemini API');
        }

        return data.candidates[0].content.parts[0].text;
    };

    /**
     * Sends message to selected AI model
     */
    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        const userInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const conversationHistory = messages.filter(m => !m.isError);
            let aiResponse = '';

            // Route to appropriate API handler
            switch (selectedModel) {
                case 'claude':
                    aiResponse = await callClaudeAPI(userInput, conversationHistory);
                    break;
                case 'openai':
                    aiResponse = await callOpenAIAPI(userInput, conversationHistory);
                    break;
                case 'gemini':
                    aiResponse = await callGeminiAPI(userInput, conversationHistory);
                    break;
                default:
                    throw new Error('Invalid model selected');
            }

            // Add AI response to messages
            const aiMessage = {
                role: 'assistant',
                content: aiResponse,
                model: models[selectedModel].name,
                timestamp: new Date().toLocaleTimeString()
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Error details:', error);

            // Display user-friendly error message
            const errorMessage = {
                role: 'assistant',
                content: `⚠️ Error: ${error.message}\n\n🔧 Troubleshooting:\n• Verify API key is valid and active\n• Check sufficient credits/quota available\n• Ensure stable network connection\n• Confirm API endpoint accessibility`,
                model: 'System Error',
                timestamp: new Date().toLocaleTimeString(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Clears all messages from chat
     */
    const clearChat = () => {
        setMessages([]);
    };

    /**
     * Handles Enter key press for sending messages
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black relative overflow-hidden">
            {/* Animated Background - Enhanced Grok-Style */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}></div>

                {/* Radial Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="bg-black/80 backdrop-blur-xl border-b border-purple-500/30 p-4 shadow-2xl">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
                                <div className="absolute inset-0 w-10 h-10 bg-purple-500 rounded-full filter blur-xl opacity-50"></div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                    LOK|A|
                                </h1>
                                <p className="text-sm text-purple-300/80">Multi-Model AI Intelligence</p>
                            </div>
                        </div>
                        <button
                            onClick={clearChat}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear
                        </button>
                    </div>
                </div>

                {/* Model Selector */}
                <div className="bg-black/60 backdrop-blur-xl border-b border-purple-500/20 p-3">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-3 overflow-x-auto">
                            {Object.entries(models).map(([key, model]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedModel(key)}
                                    disabled={isLoading}
                                    className={`px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                                        selectedModel === key
                                            ? `bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 scale-105`
                                            : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800/70 border border-purple-500/20 hover:scale-102'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <span>{model.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-purple-300/60 mt-20">
                                <div className="relative inline-block mb-4">
                                    <Sparkles className="w-20 h-20 mx-auto animate-pulse text-purple-400" />
                                    <div className="absolute inset-0 w-20 h-20 bg-purple-500 rounded-full filter blur-2xl opacity-40 mx-auto"></div>
                                </div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                    Welcome to LOK|A|
                                </p>
                                <p className="text-sm mt-2 text-purple-400/80">Select a model and unleash the power of AI</p>
                                <div className="mt-8 space-y-3 text-xs text-purple-500/60">
                                    <p className="flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                        Full conversation history maintained
                                    </p>
                                    <p className="flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse animation-delay-1000"></span>
                                        Switch models anytime
                                    </p>
                                    <p className="flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-2000"></span>
                                        Real-time AI integration
                                    </p>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-3xl rounded-2xl px-6 py-4 backdrop-blur-xl transition-all ${
                                            msg.role === 'user'
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                                                : msg.isError
                                                ? 'bg-red-900/30 text-red-100 border border-red-500/50 shadow-lg shadow-red-500/20'
                                                : 'bg-gray-900/70 text-gray-100 border border-purple-500/20 shadow-lg shadow-purple-500/10'
                                        }`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 text-xs font-semibold mb-2 text-purple-300/80">
                                                {msg.isError ? (
                                                    <>
                                                        <AlertCircle className="w-3 h-3" />
                                                        {msg.model}
                                                    </>
                                                ) : (
                                                    <span>{msg.model}</span>
                                                )}
                                            </div>
                                        )}
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        <div className="text-xs opacity-60 mt-2">{msg.timestamp}</div>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl px-6 py-4 flex items-center gap-3 border border-purple-500/20 shadow-lg shadow-purple-500/20">
                                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                    <span className="text-purple-300">
                                        {models[selectedModel].name} is thinking...
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-black/60 backdrop-blur-xl border-t border-purple-500/30 p-4">
                    <div className="max-w-4xl mx-auto flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={`Ask ${models[selectedModel].name} anything...`}
                            className="flex-1 bg-gray-900/70 text-white rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400/50 border border-purple-500/20 backdrop-blur-xl shadow-lg transition-all"
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl px-6 py-4 flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }

                .animate-blob {
                    animation: blob 10s infinite;
                }

                .animation-delay-1000 {
                    animation-delay: 1s;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }

                .hover\:scale-102:hover {
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
};

export default MultiAIChatbot;
