import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '1rem' }}>
        Welcome to Your Personalized Learning Assistant
      </h1>
      <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Get started by creating a personalized study plan tailored to your learning goals.
      </p>
      
      <div style={{
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#1f2937', marginTop: 0 }}>How it works:</h2>
        <ol style={{ color: '#4b5563', lineHeight: '1.8' }}>
          <li>Create a study plan based on your subject, level, and duration</li>
          <li>Get explanations for topics from our AI teacher</li>
          <li>Ask questions and get instant answers</li>
          <li>Test your knowledge with interactive quizzes</li>
        </ol>
      </div>

      <Link
        to="/create-plan"
        style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          backgroundColor: '#2563eb',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}
      >
        Create Your Study Plan →
      </Link>
    </div>
  );
}

