import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const createStudyPlan = async (subject, level, duration_weeks, learner_name) => {
  const response = await axios.post(`${API_BASE}/start-learning`, {
    subject,
    level,
    duration_weeks,
    learner_name
  });
  return response.data;
};

export const getStudyPlan = async () => {
  // This would fetch from context store if we add an endpoint
  // For now, we'll rely on the plan being returned from createStudyPlan
  return null;
};

