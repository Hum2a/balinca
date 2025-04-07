import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultsScreen.css';
import crownIcon from '../assets/icons/crown.png';

const ResultsScreen = ({ teams, quizComplete, onNextQuestion }) => {
  const [barWidths, setBarWidths] = useState({});
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [rankedTeams, setRankedTeams] = useState([]);
  const navigate = useNavigate();
  const maxPoints = 23;

  // Calculate sorted and ranked teams
  useEffect(() => {
    if (!teams || teams.length === 0) return;

    // First sort the teams by points in descending order
    const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
    
    let currentRank = 1;
    let prevPoints = null;
    
    // Then calculate ranks, handling ties correctly
    const ranked = sortedTeams.map((team, index) => {
      // If this is the first team or has different points than previous team
      if (index === 0 || team.points !== prevPoints) {
        currentRank = index + 1;
      }
      
      prevPoints = team.points;
      return { ...team, rank: currentRank };
    });

    setRankedTeams(ranked);
  }, [teams]);

  const calculateBarWidth = (points) => {
    return (points / maxPoints) * 100;
  };

  const toggleTeamExpansion = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  const goHome = () => {
    navigate('/');
  };

  const nextOrNavigateToSimulation = () => {
    if (quizComplete) {
      navigate('/sim-setup');
    } else {
      onNextQuestion();
    }
  };

  useEffect(() => {
    if (!rankedTeams || rankedTeams.length === 0) return;

    // Set initial widths to 0 for animation
    const initialWidths = {};
    rankedTeams.forEach(team => {
      initialWidths[team.name] = 0;
    });
    setBarWidths(initialWidths);

    // Animate bar widths with cascading delays
    setTimeout(() => {
      rankedTeams.forEach((team, index) => {
        setTimeout(() => {
          setBarWidths(prev => ({
            ...prev,
            [team.name]: calculateBarWidth(team.points)
          }));
        }, index * 300);
      });
    }, 200);
  }, [rankedTeams]);

  return (
    <div className="quiz-results-container">
      <div className="quiz-results-header-container">
        <button onClick={goHome} className="quiz-results-home-button">Go to Home</button>
        <h2 className="quiz-results-title">Scoreboard</h2>
        <button onClick={() => navigate('/sim-setup')} className="quiz-results-simulation-button">
          Go to Simulation
        </button>
      </div>

      <div className="quiz-results-content-wrapper">
        <div className="quiz-results-team-results">
          {rankedTeams.map((team, index) => (
            <div
              key={team.name}
              className={`quiz-results-team-bar-container ${expandedTeam === team.name ? 'expanded' : ''} ${team.rank === 1 ? 'quiz-results-winning-team' : ''}`}
              style={{
                backgroundColor: team.rank === 1 ? '#C5FF9A' : '',
                color: team.rank === 1 ? 'black' : ''
              }}
              onClick={() => toggleTeamExpansion(team.name)}
            >
              <div className="quiz-results-team-bar">
                <p className="quiz-results-team-name">
                  {team.rank}. {team.name}
                  {team.rank === 1 && (
                    <img src={crownIcon} alt="Crown" className="quiz-results-crown-icon" />
                  )}
                </p>
                <div className="quiz-results-bar-wrapper">
                  <div
                    className="quiz-results-bar"
                    style={{
                      width: `${barWidths[team.name]}%`,
                      transitionDelay: `${index * 0.2}s`
                    }}
                  />
                </div>
                <div className="quiz-results-points-info">
                  <p className="quiz-results-points" style={{ color: team.rank === 1 ? 'black' : 'white' }}>
                    ⚡ {team.points}
                  </p>
                </div>
              </div>

              {expandedTeam === team.name && (
                <div className="quiz-results-team-points-breakdown">
                  <table>
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(team.taskScores || {}).map(([task, points]) => (
                        <tr key={task}>
                          <td>Task {task}</td>
                          <td>{points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-results-next-button-container">
        <button className="quiz-results-next-button" onClick={nextOrNavigateToSimulation}>
          {quizComplete ? 'See Results' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen; 