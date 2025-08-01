'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from './components/Button';
import Card from './components/Card';
import SelectionGrid from './components/SelectionGrid';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

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