import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import FinancialQuiz from '../quiz/FinancialQuiz';
import QuizLanding from '../quiz/QuizLandingPage';
import SimSetup from '../quiz/sim/SimSetup';
import GroupCreation from '../simulation/scripts/GroupCreation';
import Simulation from '../simulation/scripts/Simulation';
import ResultsScreen from '../simulation/scripts/ResultsScreen';

const Navigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/quiz" element={<FinancialQuiz />} />
        <Route path="/quiz-landing" element={<QuizLanding />} />
        <Route path="/sim-setup" element={<SimSetup />} />
        <Route path="/group-creation" element={<GroupCreation />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/results" element={<ResultsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default Navigation; 