// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// src/App.js
import './App.css';


function App() {
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://jservice.io/api/categories', {
        params: {
          count: 5, // Adjust the number of categories as needed
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRandomQuestion = async (categoryId) => {
    try {
      const response = await axios.get('https://jservice.io/api/clues', {
        params: {
          category: categoryId,
        },
      });
      const randomIndex = Math.floor(Math.random() * response.data.length);
      setQuestion(response.data[randomIndex]);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer(''); // Clear the user's previous answer
    const randomCategoryId = categories[Math.floor(Math.random() * categories.length)].id;
    fetchRandomQuestion(randomCategoryId);
  };

  const handleAnswerSubmit = () => {
    // Check if the user's answer is correct (case-insensitive)
    if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
      // Increment the score if the answer is correct
      setScore(score + (question.value || 100));
    }
    handleNextQuestion();
  };

  useEffect(() => {
    fetchCategories();
  }, []); // Run once on component mount

  useEffect(() => {
    if (categories.length > 0) {
      handleNextQuestion();
    }
  }, [categories]); // Fetch a question when categories are loaded

  return (
    <div className="App">
      <h1>Jeopardy Game</h1>
      <div>
        <p>Score: {score}</p>
        <p>Category: {question?.category?.title}</p>
        <p>Question: {question?.question}</p>
        <p>Value: {question?.value || 'N/A'}</p>
        <input
          type="text"
          placeholder="Your answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        <button onClick={handleAnswerSubmit}>Submit Answer</button>
        <button onClick={handleNextQuestion}>Next Question</button>
      </div>
    </div>
  );
}

export default App;
