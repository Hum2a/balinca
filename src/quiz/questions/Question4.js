import React, { useState, useEffect } from 'react';
import './styles/Question4.css';
import lightningBolt from '../../assets/icons/Lightning Bolt.png';
import moneyBars from '../../assets/icons/moneybars.png';
import InvestmentCalculator from '../widgets/InvestmentCalculator';

const Question4 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(240);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [glossaryTitle, setGlossaryTitle] = useState('');
  const [glossaryContent, setGlossaryContent] = useState('');
  const [hoverModal, setHoverModal] = useState({
    show: false,
    title: "",
    content: "",
    x: 0,
    y: 0,
  });
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const [detailedAnswerShown, setDetailedAnswerShown] = useState(false);

  const correctAnswer = 'C';

  useEffect(() => {
    let intervalId;
    if (timerStarted && timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerStarted, timer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const progressBarWidth = (timer / 240) * 100;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const showHoverModal = (title, content, event) => {
    if (!event) return;
    setHoverModal({
      show: true,
      title,
      content,
      x: event.clientX + 15,
      y: event.clientY + 15
    });
  };

  const hideHoverModal = () => {
    setHoverModal(prev => ({ ...prev, show: false }));
  };

  const openGlossary = (term) => {
    setShowGlossary(true);
    if (term === 'stocksFundPortfolio') {
      setGlossaryTitle('Stocks Fund Portfolio');
      setGlossaryContent('A basket of different companies that are all put together. When you buy a part of the basket, you own a small piece of all the companies in it. This helps spread the risk because if one company doesn\'t do well, others in the basket might still grow!');
    } else if (term === 'sAndP500') {
      setGlossaryTitle('S&P 500');
      setGlossaryContent('A list of the 500 biggest and most important companies in America. If you invest in the S&P 500, you\'re buying a little piece of each of those 500 companies.');
    } else if (term === 'annually') {
      setGlossaryTitle('Annually');
      setGlossaryContent('The return rate is calculated based on a yearly period. For example, an 8% annual return means an 8% increase over one year.');
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map(answer => (answer === correctAnswer ? 3 : 0));
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  const toggleDetailedAnswer = () => {
    setDetailedAnswerShown(!detailedAnswerShown);
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <div className="question4-container">
      {/* Progress Bar Container */}
      <div className="question4-progress-bar-container">
        <div className="question4-progress-bar">
          <div className="question4-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>
        
        <div className="question4-timer-container">
          {!timerStarted ? (
            <button onClick={() => setTimerStarted(true)} className="question4-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question4-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Header */}
      <div className="question4-task-header">
        <div className="question4-header-content">
          <div className="question4-points-section">
            <h3>Challenge 4</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question4-lightning-bolt" />
            <p className="question4-points">3 points</p>
          </div>
          <div className="question4-button-container">
            <button className="question4-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>

        <div className="question4-content-wrapper">
          <div className="question4-text-content">
            <p>Noura earns 5,000 SAR a month from her tutoring job. She carefully plans her monthly spending:</p>
            
            <div className="question4-expenses-cards">
              <div className="question4-card">
                <h4>Monthly Expenses</h4>
                <ul>
                  <li>
                    <span className="question4-expense-icon">🏠</span>
                    <span className="question4-expense-label">Rent to parents</span>
                    <span className="question4-expense-amount">1,200 SAR</span>
                  </li>
                  <li>
                    <span className="question4-expense-icon">🚗</span>
                    <span className="question4-expense-label">Transport & food</span>
                    <span className="question4-expense-amount">1,600 SAR</span>
                  </li>
                  <li>
                    <span className="question4-expense-icon">🛍️</span>
                    <span className="question4-expense-label">Entertainment</span>
                    <span className="question4-expense-amount">1,000 SAR</span>
                  </li>
                </ul>
              </div>
              <div className="question4-card">
                <h4>Unexpected Expense</h4>
                <ul>
                  <li>
                    <span className="question4-expense-icon">🔧</span>
                    <span className="question4-expense-label">Car repair</span>
                    <span className="question4-expense-amount">800 SAR</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <img src={moneyBars} alt="Task 4" className="question4-task-image" />
        </div>
      </div>

      {!showResults ? (
        <>
          <div className="question4-question-section">
            <p className="question4-question">How much did she actually save last month, and what is the best financial habit she could build?</p>
          </div>

          <div className="question4-choices-container">
            <button className="question4-choice-button">A. She saved 1,200 SAR – this is 20% of her income so she should keep doing the same</button>
            <button className="question4-choice-button">B. She saved 1,200 SAR – She should start to save more for emergencies</button>
            <button className="question4-choice-button">C. She saved 400 SAR - She should set money aside for emergencies</button>
            <button className="question4-choice-button">D. She saved 400 SAR – which means she still has enough money</button>
            <button className="question4-choice-button">E. She saved nothing — and needs to increase her income</button>
          </div>

          <div className="question4-team-answer-section">
            <h4>Your answers</h4>
            <div className="question4-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question4-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question4-answer-select"
                  >
                    <option value="" disabled>Select</option>
                    {['A', 'B', 'C', 'D', 'E'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <button className="question4-submit-button" onClick={submitAnswers}>Submit</button>
          </div>
        </>
      ) : (
        <div className="question4-result-section">
          <h4>Correct Answer:</h4>
          <div className="question4-answer-value">
            C. She saved 400 SAR - She should set money aside for emergencies
          </div>
          
          <button 
            onClick={toggleDetailedAnswer} 
            className="question4-toggle-detailed-answer"
            data-expanded={detailedAnswerShown}
          >
            {detailedAnswerShown ? 'Hide explanation' : 'Show explanation'}
          </button>

          <div className={`question4-expanded-answer ${detailedAnswerShown ? 'show' : ''}`}>
            <div className="question4-calculation">
              <h4>Monthly Budget Breakdown</h4>
              <table className="question4-budget-table">
                <tbody>
                  <tr><td>Monthly Income:</td><td>5,000 SAR</td></tr>
                  <tr><td>Rent:</td><td>-1,200 SAR</td></tr>
                  <tr><td>Transport & food:</td><td>-1,600 SAR</td></tr>
                  <tr><td>Entertainment:</td><td>-1,000 SAR</td></tr>
                  <tr><td>Car repair:</td><td>-800 SAR</td></tr>
                  <tr className="question4-total-row"><td>Saved:</td><td>400 SAR</td></tr>
                </tbody>
              </table>

              <div className="question4-explanation">
                <h4>Key Takeaways:</h4>
                <ul>
                  <li>Regular monthly expenses total 3,800 SAR (76% of income)</li>
                  <li>Unexpected car repair cost 800 SAR (16% of income)</li>
                  <li>Only 400 SAR saved (8% of income)</li>
                  <li>Building an emergency fund would help handle unexpected expenses better</li>
                </ul>
              </div>
            </div>
          </div>

          <h4 className="question4-your-answers">Your answers</h4>
          <div className="question4-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question4-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question4-correct' : 'question4-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="question4-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question4-hint-modal-overlay">
          <div className="question4-hint-modal">
            <h3>Hint</h3>
            <p>Calculate her total expenses (including the car repair) and subtract from her monthly income.</p>
            <button onClick={() => setShowHintModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="question4-glossary-sidebar">
          <div className="question4-glossary-header">
            <h2>{glossaryTitle}</h2>
            <button className="question4-close-button" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div className="question4-glossary-content">
            <p>{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question4-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question4; 