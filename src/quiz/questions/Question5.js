import React, { useState, useEffect } from 'react';
import './styles/Question5.css';
import lightningBolt from '../../assets/icons/Lightning Bolt.png';
import moneyBars from '../../assets/icons/moneybars.png';
import InvestmentCalculator from '../widgets/InvestmentCalculator';

const Question5 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(240);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [hoverModal, setHoverModal] = useState({
    show: false,
    title: "",
    content: "",
    x: 0,
    y: 0,
  });
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const [detailedAnswerShown, setDetailedAnswerShown] = useState(false);

  const correctAnswer = 'D';

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

  const showModal = (term, event) => {
    if (!event) return;
    setHoverModal({
      show: true,
      title: term,
      content: term === 'TASI' ? 'The Tadawul All Share Index (TASI) is the main stock market index in Saudi Arabia. It represents the overall performance of the Saudi stock market and includes many of the country\'s biggest companies.' : '',
      x: event.clientX + 15,
      y: event.clientY + 15
    });
  };

  const hideModal = () => {
    setHoverModal(prev => ({ ...prev, show: false }));
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  const submitAnswers = () => {
    setShowResults(true);
    const pointsArray = teamAnswers.map(answer => (answer === correctAnswer ? 3 : 0));
    onAwardPoints(pointsArray);
  };

  const nextQuestion = () => {
    onNextQuestion();
  };

  return (
    <div className="question5-container">
      {/* Progress Bar Container */}
      <div className="question5-progress-bar-container">
        <div className="question5-progress-bar">
          <div className="question5-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>
        
        <div className="question5-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question5-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question5-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Header */}
      <div className="question5-task-header">
        <div className="question5-header-content">
          <div className="question5-points-section">
            <h3>Challenge 5</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question5-lightning-bolt" />
            <p className="question5-points">3 points</p>
          </div>
          <div className="question5-button-container">
            <button className="question5-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <img src={moneyBars} alt="Task 5 Image" className="question5-task-image" />
        <p>
          Noura has been saving consistently from her tutoring work and decides to invest 500 SAR each month. She chooses to invest in a low-cost index fund that tracks the 
          <span
            className="question5-clickable-term"
            onMouseOver={(e) => showModal('TASI', e)}
            onMouseLeave={hideModal}
          > Tadawul All Share Index (TASI)</span>.
        </p>
        <p>TASI represents the overall performance of the Saudi stock market and includes many of the country's biggest companies. Over the long term, TASI has delivered average annual returns of around 7%, though it can go up or down in any given year.</p>
      </div>

      {/* Investment Details Section */}
      <div className="question5-investment-wrapper">
        <div className="question5-investment-details">
          <div className="question5-card">
            <h4>Investment Plan</h4>
            <ul>
              <li>
                <span className="question5-investment-icon">💰</span>
                <span className="question5-investment-label">Monthly Investment</span>
                <span className="question5-investment-value">SAR 500</span>
              </li>
              <li>
                <span className="question5-investment-icon">📈</span>
                <span className="question5-investment-label">Expected Return</span>
                <span className="question5-investment-value">7% annually</span>
              </li>
              <li>
                <span className="question5-investment-icon">⏳</span>
                <span className="question5-investment-label">Time Period</span>
                <span className="question5-investment-value">10 years</span>
              </li>
            </ul>
          </div>
          <div className="question5-card">
            <h4>Investment Benefits</h4>
            <ul>
              <li>
                <span className="question5-investment-icon">🎯</span>
                <span className="question5-investment-label">Diversification</span>
                <span className="question5-investment-value">Multiple companies</span>
              </li>
              <li>
                <span className="question5-investment-icon">📊</span>
                <span className="question5-investment-label">Market Growth</span>
                <span className="question5-investment-value">Long-term potential</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {!showResults ? (
        <div>
          {/* Question Section */}
          <div className="question5-question-section">
            <p className="question5-question">If Noura invests SAR 500 a month, and gets an annual return of 7% every year, approximately how much money will she have in the account after 10 years?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="question5-choices-container">
            <button className="question5-choice-button">A. SAR 25,000</button>
            <button className="question5-choice-button">B. SAR 40,000</button>
            <button className="question5-choice-button">C. SAR 55,000</button>
            <button className="question5-choice-button">D. SAR 85,000</button>
            <button className="question5-choice-button">E. SAR 110,000</button>
          </div>

          {/* Team Answer Section */}
          <div className="question5-team-answer-section">
            <h4>Your answers</h4>
            <div className="question5-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question5-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question5-answer-select"
                  >
                    <option value="" disabled>Select answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button className="question5-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question5-result-section">
          <h4>Correct Answer:</h4>
          <p className="question5-correct-answer">SAR 85,000</p>
          <p className="question5-correct-answer-description">Total investment value after 10 years</p>
          <p className="question5-correct-answer-description"><strong>Monthly Investment × Time × (1 + Return Rate)</strong></p>
          <p className="question5-correct-answer-description">SAR 500 × 120 months with 7% annual compound growth</p>

          <div className="question5-expanded-answer">
            <div className="question5-calculation">
              <h4>How the money grows:</h4>
              <div className="question5-detail-cards">
                <div className="question5-detail-card">
                  <span className="question5-detail-label">Total Contributions</span>
                  <span className="question5-detail-value">60,000 SAR</span>
                </div>
                <div className="question5-detail-card">
                  <span className="question5-detail-label">Investment Growth</span>
                  <span className="question5-detail-value">25,000 SAR</span>
                </div>
                <div className="question5-detail-card highlight">
                  <span className="question5-detail-label">Final Amount</span>
                  <span className="question5-detail-value">85,000 SAR</span>
                </div>
              </div>
            </div>
            <div className="question5-calculator-section">
              <h4>Try the Investment Calculator</h4>
              <InvestmentCalculator />
            </div>
          </div>

          <h4 className="question5-your-answers">Your answers</h4>
          <div className="question5-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question5-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question5-correct' : 'question5-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="question5-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question5-hint-modal-overlay">
          <div className="question5-hint-modal">
            <h3>Hint</h3>
            <p>Think about compound interest - your returns each year are reinvested and can earn additional returns. Also consider that you're adding 500 SAR every month for 10 years (that's 60,000 SAR in total contributions).</p>
            <button onClick={() => setShowHintModal(false)} className="question5-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question5-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h4>{hoverModal.title}</h4>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question5; 