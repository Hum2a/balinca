import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizLandingPage.css';

// Import icons (you'll need to add these to your assets folder)
import piggyBankIcon from '../assets/icons/piggy_bank.png';
import dollarTreeIcon from '../assets/icons/dollar_tree.png';
import chartIcon from '../assets/icons/chart.png';
import cardIcon from '../assets/icons/card.png';
import moneyIcon from '../assets/icons/money.png';
import seedIcon from '../assets/icons/seed.png';
import graduateIcon from '../assets/icons/graduate.png';

const QuizLandingPage = () => {
  const navigate = useNavigate();
  const [showTeamCreation, setShowTeamCreation] = useState(false);
  const [teamCount, setTeamCount] = useState(1);
  const [teams, setTeams] = useState(Array(1).fill(""));
  const maxTeams = 10000;

  const startTeamCreation = () => {
    setShowTeamCreation(true);
  };

  const increaseTeams = () => {
    if (teamCount < maxTeams) {
      setTeamCount(prevCount => prevCount + 1);
      setTeams(prevTeams => [...prevTeams, ""]);
    }
  };

  const decreaseTeams = () => {
    if (teamCount > 1) {
      setTeamCount(prevCount => prevCount - 1);
      setTeams(prevTeams => prevTeams.slice(0, -1));
    }
  };

  const handleTeamNameChange = (index, value) => {
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      newTeams[index] = value;
      return newTeams;
    });
  };

  const startQuiz = () => {
    if (teams.every(name => name.trim())) {
      // Match Vue.js navigation style using object-based navigation
      navigate({
        pathname: '/quiz',
        search: `?teams=${teams.join(',')}`
      });
    }
  };

  return (
    <div className="quiz-landing-page">
      {/* Landing Page Section */}
      {!showTeamCreation ? (
        <div className="quiz-landing-container">
          <header className="quiz-landing-header">
            <h1 className="quiz-landing-title">Welcome to</h1>
            <h1 className="quiz-landing-title">The Financial Game!</h1>
          </header>
          
          <main className="quiz-landing-main">
            <p className="quiz-landing-message">
              Welcome to the game that helps prepare you for your financial future. 
              Explore concepts like credit, loans, savings, and investments while 
              building your financial savviness.
            </p>
            <button onClick={startTeamCreation} className="quiz-landing-start-button">
              Start Game
            </button>
          </main>

          {/* Background Icons */}
          <div className="quiz-landing-background-icons">
            <img src={piggyBankIcon} alt="Piggy Bank" className="quiz-landing-icon quiz-landing-piggy-bank" />
            <img src={dollarTreeIcon} alt="Dollar Tree" className="quiz-landing-icon quiz-landing-dollar-tree" />
            <img src={chartIcon} alt="Chart" className="quiz-landing-icon quiz-landing-chart" />
            <img src={cardIcon} alt="Card" className="quiz-landing-icon quiz-landing-card" />
            <img src={moneyIcon} alt="Money" className="quiz-landing-icon quiz-landing-money" />
            <img src={seedIcon} alt="Seed" className="quiz-landing-icon quiz-landing-seed" />
            <img src={graduateIcon} alt="Graduate" className="quiz-landing-icon quiz-landing-graduate" />
          </div>
        </div>
      ) : (
        /* Team Creation Section */
        <div className="quiz-landing-team-creation">
          <header className="quiz-landing-header">
            <h1 className="quiz-landing-title">Enter Game Details</h1>
          </header>

          <main className="quiz-landing-main">
            <div className="quiz-landing-team-details">
              <div className="quiz-landing-team-number">
                <label htmlFor="teamCount">NUMBER OF TEAMS</label>
                <div className="quiz-landing-team-controls">
                  <button onClick={decreaseTeams} className="quiz-landing-control-button">-</button>
                  <input 
                    type="text" 
                    value={teamCount} 
                    id="teamCount" 
                    className="quiz-landing-count-display" 
                    readOnly 
                  />
                  <button onClick={increaseTeams} className="quiz-landing-control-button">+</button>
                </div>
              </div>

              <div className="quiz-landing-team-names">
                <label>TEAM NAMES</label>
                {teams.map((team, index) => (
                  <div key={index} className="quiz-landing-input-container">
                    <input 
                      value={team} 
                      onChange={(e) => handleTeamNameChange(index, e.target.value)} 
                      type="text" 
                      placeholder="Enter team name" 
                      className="quiz-landing-team-input" 
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={startQuiz} 
                className="quiz-landing-next-button" 
                disabled={teams.some(name => !name.trim())}
              >
                Next
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default QuizLandingPage; 