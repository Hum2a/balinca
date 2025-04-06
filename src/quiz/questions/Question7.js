import React, { useState, useEffect } from 'react';
import './styles/Question7.css';
import lightningBolt from '../../assets/icons/Lightning Bolt.png';
import moneyBars from '../../assets/icons/moneybars.png';

const Question7 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
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

  const answerOptions = [
    'A. Buy Now Pay Later — 0% interest for 3 months, then 18% per year if unpaid',
    'B. Credit Card — 15% annual interest',
    'C. Government student loan — 2% fixed interest annually',
    'D. Personal loan from private lender — 12% interest, flexible repayments',
    'E. Borrow from a friend — 0% interest but must repay in 2 months'
  ];

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

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map(answer => (answer === correctAnswer ? 2 : 0));
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  const toggleDetailedAnswer = () => {
    setDetailedAnswerShown(!detailedAnswerShown);
  };

  return (
    <div className="question7-container">
      {/* Header and Progress Bar */}
      <div className="question7-progress-bar-container">
        <div className="question7-progress-bar">
          <div className="question7-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="question7-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question7-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question7-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="question7-task-header">
        <div className="question7-top-layer">
          <div className="question7-points-section">
            <h3>Challenge 7</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question7-lightning-bolt" />
            <p className="question7-points">2 points</p>
          </div>
          <div className="question7-button-container">
            <button className="question7-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="question7-task-header-question">
          <p>Noura has been tutoring younger students for some time and now wants to take her learning further. She's found a great short course in digital marketing that she believes will help her land freelance work in the future.</p>
          <p>The total cost comes to 10,000 SAR. She doesn't have the money saved but plans to repay the full amount within five months from her earnings.</p>
          <img src={moneyBars} alt="Task 7 Image" className="question7-task-image" />
        </div>
      </div>

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question7-hint-modal-overlay">
          <div className="question7-hint-modal">
            <h3>Hint</h3>
            <p>Consider the interest rates, repayment terms, and potential risks of each option. Think about which option provides the most stability and flexibility for her five-month repayment plan.</p>
            <button onClick={() => setShowHintModal(false)} className="question7-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {!showResults ? (
        <div>
          {/* Question Section */}
          <div className="question7-question-section">
            <p className="question7-question-text">Which is the smartest option for Noura and why?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="question7-choices-container">
            {answerOptions.map((option, index) => (
              <button key={index} className="question7-choice-button">
                {option}
              </button>
            ))}
          </div>

          {/* Team Answer Section */}
          <div className="question7-team-answer-section">
            <h4>Your answers</h4>
            <div className="question7-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question7-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question7-answer-select"
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

          <button className="question7-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question7-result-section">
          <h4>Correct Answer:</h4>
          <p className="question7-correct-answer">C. Government student loan — 2% fixed interest annually</p>
          <p onClick={toggleDetailedAnswer} className="question7-toggle-detailed-answer">
            Click to {detailedAnswerShown ? 'hide explanation ⬆️' : 'see explanation ⬇️'}
          </p>

          {detailedAnswerShown && (
            <div className="question7-expanded-answer">
              <h4>Why this is the best choice:</h4>
              <div className="question7-explanation">
                <p>The government student loan is the smartest choice because:</p>
                <ul>
                  <li>Lowest interest rate (2% fixed)</li>
                  <li>Stable, predictable repayments</li>
                  <li>Designed specifically for education</li>
                  <li>Longer repayment window if needed</li>
                  <li>Legal protections and formal structure</li>
                </ul>

                <h4>Why other options are riskier:</h4>
                <ul>
                  <li><strong>Buy Now Pay Later (A):</strong> High interest after 3 months (18%) could be problematic if she needs all 5 months to repay</li>
                  <li><strong>Credit Card (B):</strong> High interest rate (15%) makes this an expensive option</li>
                  <li><strong>Personal Loan (D):</strong> Higher interest rate (12%) and may have hidden fees</li>
                  <li><strong>Friend Loan (E):</strong> Short repayment window (2 months) creates pressure and could damage relationships</li>
                </ul>
              </div>
            </div>
          )}

          {/* Display each team's answer with comparison */}
          <div className="question7-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question7-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question7-correct' : 'question7-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="question7-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question7-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question7; 