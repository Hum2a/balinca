import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Question0 from './questions/Question0';
import Question1 from './questions/Question1';
import Question2 from './questions/Question2';
import Question3 from './questions/Question3';
import Question4 from './questions/Question4';
import Question5 from './questions/Question5';
import Question6 from './questions/Question6';
import Question7 from './questions/Question7';
import Question8 from './questions/Question8';
import Question9 from './questions/Question9';
import ResultsScreen from './ResultsScreen';
import './FinancialQuiz.css';

const FinancialQuiz = () => {
  const location = useLocation();
  const [teams, setTeams] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Parse teams from URL parameters
    const params = new URLSearchParams(location.search);
    const teamsParam = params.get('teams');
    if (teamsParam) {
      const teamNames = teamsParam.split(',');
      const initialTeams = teamNames.map(name => ({
        name: name.trim(),
        points: 0,
        taskScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }
      }));
      setTeams(initialTeams);
    }
  }, [location]);

  const questions = [
    Question0,
    Question1,
    Question2,
    Question3,
    Question4,
    Question5,
    Question6,
    Question7,
    Question8,
    Question9
  ];

  const CurrentQuestionComponent = questions[currentQuestionIndex];
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  const updateScores = (scores) => {
    setTeams(prevTeams => {
      return prevTeams.map((team, index) => {
        const currentTask = currentQuestionIndex;
        return {
          ...team,
          points: team.points + (scores[index] || 0),
          taskScores: {
            ...team.taskScores,
            [currentTask]: scores[index] || 0
          }
        };
      });
    });
  };

  const nextQuestion = () => {
    setShowResults(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  if (teams.length === 0) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading teams...</p>
      </div>
    );
  }

  // Special handling for Question0 (intro screen)
  if (currentQuestionIndex === 0) {
    return <CurrentQuestionComponent onNextQuestion={nextQuestion} />;
  }

  return (
    <div className="financial-quiz">
      <main className="main-content">
        {showResults && currentQuestionIndex < 9 ? (
          <ResultsScreen
            teams={sortedTeams}
            quizComplete={quizComplete}
            onNextQuestion={nextQuestion}
          />
        ) : (
          <CurrentQuestionComponent
            teams={teams}
            onAnswer={() => {
              if (currentQuestionIndex === 9) {
                setQuizComplete(true);
              }
            }}
            onNextQuestion={() => {
              if (currentQuestionIndex === 9) {
                setQuizComplete(true);
                nextQuestion();
              } else {
                setShowResults(true);
              }
            }}
            onAwardPoints={updateScores}
          />
        )}
      </main>

      <footer className="footer">
        <p className="footer-text">© 2024 Life Smart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FinancialQuiz; 