import { useEffect, useRef, useState } from "react";
import { FiSend, FiUser, FiMessageSquare, FiSun, FiMoon } from "react-icons/fi";

export default function App() {
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const esRef = useRef(null);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendStream = () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    // Close previous stream if exists
    if (esRef.current) esRef.current.close();

    const params = new URLSearchParams();
    params.set("q", input);
    if (conversationId) params.set("conversationId", conversationId);

    const es = new EventSource(`http://localhost:4000/api/chat/stream?${params.toString()}`);
    esRef.current = es;

    // Add user message and empty assistant placeholder
    setMessages((prev) => [
      ...prev, 
      { role: "user", content: input, id: Date.now() },
      { role: "assistant", content: "", id: Date.now() + 1 }
    ]);
    setInput("");

    es.onmessage = (e) => {
      setMessages((prev) => {
        const copy = [...prev];
        const lastMsg = copy[copy.length - 1];
        if (lastMsg.role === "assistant") {
          copy[copy.length - 1] = { 
            ...lastMsg, 
            content: (lastMsg.content || "") + e.data 
          };
        }
        return copy;
      });
    };

    es.addEventListener("done", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.conversationId) setConversationId(data.conversationId);
      } catch (e) {
        console.error("Error parsing done event:", e);
      }
      setIsLoading(false);
      es.close();
    });

    es.addEventListener("error", (e) => {
      console.error("EventSource error:", e);
      setIsLoading(false);
      es.close();
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendStream();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-b border-gray-200'
      } shadow-sm transition-colors duration-200`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <FiMessageSquare className={`text-2xl mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className="text-xl font-bold">AI Chat Assistant</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FiSun className="text-yellow-300" /> : <FiMoon className="text-gray-600" />}
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-[60vh] ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <FiMessageSquare className="text-6xl mb-4 opacity-20" />
            <h2 className="text-xl font-medium mb-2">How can I help you today?</h2>
            <p className="text-sm">Ask me anything or start a conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`flex max-w-[85%] lg:max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? darkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-600 text-white'
                    : darkMode 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="mr-3 mt-0.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <FiMessageSquare className="text-lg" />
                    </div>
                  </div>
                )}
                <div className="min-w-0">
                  <div className={`text-xs font-medium mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="whitespace-pre-wrap break-words leading-relaxed">
                    {message.content || (isLoading && message.role === 'assistant' ? (
                      <span className="inline-block w-2 h-2 mx-0.5 bg-gray-400 rounded-full animate-bounce" style={{
                        animationDelay: '0.2s'
                      }}></span>
                    ) : '')}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="ml-3 mt-0.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <FiUser className="text-lg" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`fixed bottom-0 left-0 right-0 ${
        darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'
      } py-4 px-4 transition-colors duration-200`}>
        <div className="max-w-3xl mx-auto relative">
          <div className={`relative rounded-2xl shadow-sm ${
            darkMode ? 'bg-gray-700' : 'bg-white border border-gray-300'
          } transition-colors duration-200`}>
            <textarea
              className={`block w-full px-4 py-3 pr-12 focus:outline-none resize-none rounded-2xl bg-transparent ${
                darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
              rows="1"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />
            <div className="absolute right-2 bottom-2">
              <button
                onClick={sendStream}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-full transition-all ${
                  !input.trim() || isLoading
                    ? darkMode
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                }`}
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSend className="text-lg" />
                )}
              </button>
            </div>
          </div>
          <p className={`text-xs text-center mt-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {isLoading ? 'AI is thinking...' : 'Press Enter to send, Shift+Enter for new line'}
          </p>
        </div>
      </div>
    </div>
  );
}
