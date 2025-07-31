'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

export default function InterviewPage() {
  const { role } = useParams();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get('difficulty') || 'medium';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Start initial interview when component loads
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: 'Welcome to your interview. Ready?' }]);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const updatedMessages = [...messages, { role: 'user', content: input }];
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
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Server error.' }]);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, messages }),
      });

      const data = await res.json();
      setReview(data.review || 'No review generated.');
    } catch (err) {
      setReview('Failed to generate review.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">{role} Interview ({difficulty})</h1>

      <div className="border p-4 rounded mb-4 h-[400px] overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.role === 'user' ? 'text-blue-800' : 'text-green-800'}`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      {!review && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
            className="flex-1 border px-3 py-2 rounded"
            placeholder="Type your response..."
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      )}

      {!review && (
        <button
          onClick={endInterview}
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          End Interview & Get Review
        </button>
      )}

      {review && (
        <div className="mt-6 p-4 bg-yellow-100 border rounded">
          <h2 className="text-lg font-semibold mb-2">📝 Interview Review</h2>
          <p>{review}</p>
        </div>
      )}
    </div>
  );
}