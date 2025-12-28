import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const explainTopic = async (module_id, topic) => {
  const response = await axios.post(`${API_BASE}/explain-topic`, {
    module_id,
    topic
  });
  return response.data;
};

export const solveDoubt = async (module_id, question) => {
  const response = await axios.post(`${API_BASE}/ask-doubt`, {
    module_id,
    question
  });
  return response.data;
};

export const generateQuiz = async (module_id, num_questions = 5) => {
  const response = await axios.post(`${API_BASE}/generate-quiz`, {
    module_id,
    num_questions
  });
  return response.data;
};

export const getTopicBrief = async (topic) => {
  // Replace with your actual base URL if different (e.g., http://localhost:8000)
  const response = await axios.post('/get-topic-brief', { topic });
  return response.data;
};