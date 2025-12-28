import React from 'react';

export default function ModuleCard({ module, onExplain, onQuiz, onAskQuestion, onShowBrief }) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0, color: '#111827' }}>{module.title}</h3>
        <span style={badgeStyle}>{module.duration_days} Days</span>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h4 style={sectionTitleStyle}>Daily Tasks</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
          {module.daily_tasks?.map((task, index) => (
            <li key={index} style={taskItemStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ color: '#374151', fontSize: '0.95rem' }}>
                  <strong>Day {index + 1}:</strong> {task}
                </span>
                {/* THE NEW BRIEF BUTTON */}
                <button 
                  onClick={() => onShowBrief(task)}
                  style={briefButtonStyle}
                  title="View Modern Learning Card"
                >
                  📖 Brief
                </button>
              </div>
            </li>
          ))}
        </ul>

        <h4 style={sectionTitleStyle}>Learning Objectives</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {module.learning_objectives?.map((obj, index) => (
            <span key={index} style={objBadgeStyle}>{obj}</span>
          ))}
        </div>

        {/* FOOTER ACTIONS */}
        <div style={actionsStyle}>
          <button onClick={() => onExplain(module.id, module.title, module.learning_objectives)} style={btnPrimary}>
            Explain Module
          </button>
          <button onClick={() => onAskQuestion(module.id, module.title, module.learning_objectives)} style={btnSecondary}>
            Ask Doubt
          </button>
          <button onClick={() => onQuiz(module.id)} style={btnOutline}>
            Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MODERN STYLES ---
const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  marginBottom: '2rem',
  overflow: 'hidden',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

const headerStyle = {
  backgroundColor: '#f9fafb',
  padding: '1rem 1.5rem',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const briefButtonStyle = {
  padding: '4px 10px',
  fontSize: '12px',
  backgroundColor: '#EEF2FF',
  color: '#4F46E5',
  border: '1px solid #C7D2FE',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontWeight: '600'
};

const taskItemStyle = {
  padding: '10px 0',
  borderBottom: '1px dashed #e5e7eb',
  display: 'flex'
};

const objBadgeStyle = {
  fontSize: '0.8rem',
  backgroundColor: '#F3F4F6',
  color: '#4B5563',
  padding: '4px 10px',
  borderRadius: '9999px',
  border: '1px solid #E5E7EB'
};

const sectionTitleStyle = {
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#9CA3AF',
  marginBottom: '0.75rem'
};

const badgeStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  backgroundColor: '#DBEAFE',
  color: '#1E40AF',
  padding: '2px 8px',
  borderRadius: '4px'
};

const actionsStyle = {
  display: 'flex',
  gap: '10px',
  borderTop: '1px solid #f3f4f6',
  paddingTop: '1.5rem'
};

const btnPrimary = { flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#4F46E5', color: 'white', cursor: 'pointer', fontWeight: '600' };
const btnSecondary = { flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: 'white', cursor: 'pointer', fontWeight: '600' };
const btnOutline = { flex: 0.5, padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer', fontWeight: '600' };