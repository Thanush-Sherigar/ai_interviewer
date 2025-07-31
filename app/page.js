'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  const startInterview = () => {
    if (!role) return alert('Please choose a role');
    router.push(`/interview/${role}?difficulty=${difficulty}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">AI Interviewer</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Choose a role:</label>
        {['frontend', 'backend', 'devops'].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`mr-2 px-4 py-2 rounded ${
              role === r ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Choose difficulty:</label>
        {['easy', 'medium', 'hard'].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`mr-2 px-4 py-2 rounded ${
              difficulty === d ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            {d.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        onClick={startInterview}
        className="mt-4 bg-black text-white px-6 py-2 rounded"
      >
        Start Interview
      </button>
    </div>
  );
}