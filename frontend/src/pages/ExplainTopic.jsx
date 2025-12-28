import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { explainTopic } from '../api/agentApi';

export default function ExplainTopic() {
  const location = useLocation();
  const navigate = useNavigate();
  const { moduleId, moduleTitle, learningObjectives } = location.state || {};
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);

  // Extract topic names from objectives for quick selection
  const extractTopicFromObjective = (objective) => {
    // Try to extract the main topic name
    if (objective.includes(':')) {
      return objective.split(':')[1]?.trim() || objective;
    }
    // Remove common prefixes
    const cleaned = objective
      .replace(/^Master the fundamentals of \w+:?\s*/i, '')
      .replace(/^Learn \w+\s+/i, '')
      .replace(/^Master \w+\s+/i, '')
      .replace(/^Explore advanced \w+\s+/i, '')
      .trim();
    return cleaned || objective;
  };

  const quickTopics = learningObjectives?.map(extractTopicFromObjective) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const result = await explainTopic(moduleId || 1, topic);
      setExplanation(result.explanation);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to get explanation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <h1 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Explain Topic</h1>
      {moduleTitle && (
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Module: {moduleTitle}</p>
      )}

      {quickTopics.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#374151', marginBottom: '0.75rem', fontWeight: '500' }}>
            Quick Select from Learning Objectives:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {quickTopics.map((quickTopic, idx) => (
              <button
                key={idx}
                onClick={() => setTopic(quickTopic)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#1f2937',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                {quickTopic}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
            Or enter a custom topic:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic to explain..."
              required
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Explaining...' : 'Explain'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {explanation && (
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ color: '#1f2937', marginTop: 0 }}>{explanation.topic}</h2>
          <div
            style={{
              color: '#374151',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap'
            }}
            dangerouslySetInnerHTML={{ __html: explanation.explanation_md?.replace(/\n/g, '<br/>') }}
          />
        </div>
      )}
    </div>
  );
}

