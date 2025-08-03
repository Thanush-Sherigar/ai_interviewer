'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from './components/Button';
import Card from './components/Card';
import SelectionGrid from './components/SelectionGrid';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  useEffect(() => {
    // If authenticated, redirect to the main home page
    if (status === "authenticated") {
      // No need to redirect, just show the content
    }
  }, [status, router]);

  // If loading, show loading state
  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8">Loading...</div>
      </main>
    );
  }

  // Show login button if not authenticated
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">AI Interviewer</h1>
          <button
            onClick={() => signIn('github')}
            className="flex items-center justify-center w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Sign in with GitHub
          </button>
        </div>
      </main>
    );
  }

  const roleOptions = [
    {
      value: 'frontend',
      label: 'Frontend Developer',
      description: 'HTML, CSS, JavaScript, React',
      icon: '🎨'
    },
    {
      value: 'backend',
      label: 'Backend Developer', 
      description: 'APIs, Databases, Server Logic',
      icon: '⚙️'
    },
    {
      value: 'devops',
      label: 'DevOps Engineer',
      description: 'CI/CD, Docker, Kubernetes',
      icon: '🚀'
    }
  ];

  const difficultyOptions = [
    {
      value: 'easy',
      label: 'Beginner',
      description: 'Basic concepts and fundamentals',
      icon: '🌱'
    },
    {
      value: 'medium',
      label: 'Intermediate',
      description: 'Practical skills and experience',
      icon: '⚡'
    },
    {
      value: 'hard',
      label: 'Advanced',
      description: 'Complex scenarios and architecture',
      icon: '🎯'
    }
  ];

  const startInterview = () => {
    if (!role) {
      alert('Please choose a role to proceed with the interview');
      return;
    }
    router.push(`/interview/${role}?difficulty=${difficulty}`);
  };

  // Main home page content (role selection, etc.)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Interviewer</h1>
                <p className="text-sm text-gray-600">Practice technical interviews with AI</p>
              </div>
            </div>
            {session && (
              <Button onClick={() => signOut()} variant="secondary">
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ace Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Technical Interview</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Practice with our AI interviewer and get instant feedback. Choose your role, set the difficulty, and start improving your interview skills today.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1000+</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">3</div>
              <div className="text-sm text-gray-600">Difficulty Levels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-600">Practice Sessions</div>
            </div>
          </div>
        </div>

        {/* Selection Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Role Selection */}
          <Card className="animate-slideUp">
            <SelectionGrid
              title="Choose Your Role"
              options={roleOptions}
              value={role}
              onChange={setRole}
            />
          </Card>

          {/* Difficulty Selection */}
          <Card className="animate-slideUp">
            <SelectionGrid
              title="Select Difficulty Level"
              options={difficultyOptions}
              value={difficulty}
              onChange={setDifficulty}
            />
          </Card>
        </div>

        {/* Start Interview Section */}
        <Card className="text-center animate-slideUp">
          <div className="py-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Start?</h3>
            <p className="text-gray-600 mb-6">
              {role ? (
                <>You've selected <strong>{roleOptions.find(r => r.value === role)?.label}</strong> at <strong>{difficultyOptions.find(d => d.value === difficulty)?.label}</strong> level.</>
              ) : (
                'Please select a role and difficulty level to begin your interview.'
              )}
            </p>
            
            <Button
              onClick={startInterview}
              size="xl"
              disabled={!role}
              className="min-w-48"
            >
              {role ? '🚀 Start Interview' : '👆 Select Role First'}
            </Button>
            
            {role && (
              <p className="text-sm text-gray-500 mt-4">
                The interview will begin with a personalized question based on your selections
              </p>
            )}
          </div>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card hover className="text-center">
            <div className="text-3xl mb-4">🤖</div>
            <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
            <p className="text-gray-600 text-sm">Advanced AI provides realistic interview experience with dynamic questions</p>
          </Card>
          
          <Card hover className="text-center">
            <div className="text-3xl mb-4">📊</div>
            <h4 className="font-semibold text-gray-900 mb-2">Instant Feedback</h4>
            <p className="text-gray-600 text-sm">Get detailed review and suggestions to improve your performance</p>
          </Card>
          
          <Card hover className="text-center">
            <div className="text-3xl mb-4">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-2">Role-Specific</h4>
            <p className="text-gray-600 text-sm">Tailored questions for Frontend, Backend, and DevOps positions</p>
          </Card>
        </div>
      </div>
    </div>
  );
}