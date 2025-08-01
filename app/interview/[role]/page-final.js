'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ChatInterface from '../../components/ChatInterface';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function InterviewPage() {
  const { role } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = searchParams.get('difficulty') || 'medium';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  // Role configurations
  const roleConfig = {
    frontend: { icon: '🎨', color: 'primary', label: 'Frontend Developer' },
    backend: { icon: '⚙️', color: 'success', label: 'Backend Developer' },
    devops: { icon: '🚀', color: 'info', label: 'DevOps Engineer' }
  };

  const difficultyConfig = {
    easy: { icon: '🌱', color: 'success', label: 'Beginner' },
    medium: { icon: '⚡', color: 'warning', label: 'Intermediate' },
    hard: { icon: '🎯', color: 'danger', label: 'Advanced' }
  };

  // Start initial interview when component loads
  useEffect(() => {
    if (messages.length === 0 && !interviewStarted) {
      setInterviewStarted(true);
      setMessages([{ 
        role: 'assistant', 
        content: `Welcome to your ${roleConfig[role]?.label || role} interview at ${difficultyConfig[difficulty]?.label || difficulty} level! 

I'm your AI interviewer today. I'll be asking you technical questions to assess your skills and knowledge. Please answer as thoroughly as you can, and don't hesitate to explain your thought process.

Are you ready to begin? Just say "yes" or "I'm ready" when you'd like to start with the first question.` 
      }]);
    }
  }, [role, difficulty, messages.length, interviewStarted]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const updatedMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, difficulty, messages: updatedMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: 'I apologize, but I encountered an issue. Could you please repeat your last response?' 
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'I\'m experiencing technical difficulties. Please try again in a moment.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    if (messages.length < 3) {
      alert('Please have at least a brief conversation before ending the interview.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, messages }),
      });

      const data = await res.json();
      setReview(data.review || 'Unable to generate review at this time.');
    } catch (err) {
      console.error('Review error:', err);
      setReview('Failed to generate review. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const startNewInterview = () => {
    router.push('/');
  };

  const currentRole = roleConfig[role] || { icon: '❓', color: 'default', label: role };
  const currentDifficulty = difficultyConfig[difficulty] || { icon: '❓', color: 'default', label: difficulty };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={startNewInterview}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{currentRole.icon}</div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {currentRole.label} Interview
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant={currentDifficulty.color} size="sm">
                      {currentDifficulty.icon} {currentDifficulty.label}
                    </Badge>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {messages.filter(m => m.role === 'user').length} responses
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {!review && (
              <Button
                onClick={endInterview}
                variant="outline"
                size="sm"
                disabled={loading || messages.length < 3}
              >
                End Interview
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {!review ? (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card padding="none" className="h-[calc(100vh-200px)]">
                <ChatInterface
                  messages={messages}
                  input={input}
                  setInput={setInput}
                  onSendMessage={sendMessage}
                  loading={loading}
                  disabled={!!review}
                />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Tips Card */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  💡 Interview Tips
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Think out loud as you solve problems</li>
                  <li>• Ask clarifying questions when needed</li>
                  <li>• Explain your reasoning step by step</li>
                  <li>• Don't worry if you don't know everything</li>
                  <li>• Focus on problem-solving approach</li>
                </ul>
              </Card>

              {/* Progress Card */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  📊 Session Progress
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions Asked:</span>
                    <span className="font-medium">{Math.max(0, messages.filter(m => m.role === 'assistant').length - 1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Responses:</span>
                    <span className="font-medium">{messages.filter(m => m.role === 'user').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {interviewStarted ? new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }) : '00:00'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Controls Card */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    onClick={endInterview}
                    variant="success"
                    size="sm"
                    className="w-full"
                    disabled={loading || messages.length < 3}
                  >
                    {loading ? <LoadingSpinner size="sm" /> : '✅ Finish & Get Review'}
                  </Button>
                  <Button
                    onClick={startNewInterview}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    🔄 Start New Interview
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* Review Section */
          <div className="max-w-4xl mx-auto">
            <Card className="animate-fadeIn">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h2>
                <p className="text-gray-600">Here's your detailed performance review</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  📝 Performance Review
                </h3>
                <div className="prose prose-blue max-w-none">
                  {review.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">📈 Strengths</h4>
                  <p className="text-green-700 text-sm">Areas where you performed well during the interview</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">🎯 Areas for Improvement</h4>
                  <p className="text-orange-700 text-sm">Focus areas for your continued learning</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={startNewInterview} size="lg">
                  🚀 Try Another Interview
                </Button>
                <Button 
                  onClick={() => router.push('/')} 
                  variant="secondary" 
                  size="lg"
                >
                  🏠 Back to Home
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
