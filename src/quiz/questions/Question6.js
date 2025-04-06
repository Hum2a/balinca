import React, { useState, useEffect } from 'react';
import './styles/Question6.css';
import lightningBolt from '../../assets/icons/Lightning Bolt.png';
import moneyBars from '../../assets/icons/moneybars.png';

const Question6 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
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
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill([]));
  const [detailedAnswerShown, setDetailedAnswerShown] = useState(false);

  const correctAnswers = ['A', 'D', 'E'];

  const answerOptions = [
    'A. Always pay utility and phone bills on time',
    'B. Use only cash — never use credit',
    'C. Apply for lots of credit cards to build history',
    'D. Regularly check his SIMAH report for accuracy',
    'E. Use a credit card but repay in full every month',
    'F. Keep lots of money in his savings account',
    'G. Pay only the minimum required on credit cards',
    'H. Default on a loan, then pay it back later to show recovery',
    'I. Ignore credit until he\'s older'
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

  const handleTeamAnswerChange = (index, letter) => {
    const newAnswers = [...teamAnswers];
    const teamAnswerSet = new Set(newAnswers[index]);
    
    if (teamAnswerSet.has(letter)) {
      teamAnswerSet.delete(letter);
    } else if (teamAnswerSet.size < 3) {  // Limit to 3 selections
      teamAnswerSet.add(letter);
    }
    
    newAnswers[index] = Array.from(teamAnswerSet).sort();
    setTeamAnswers(newAnswers);
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map(answers => {
      const correctCount = answers.filter(answer => correctAnswers.includes(answer)).length;
      const incorrectCount = answers.filter(answer => !correctAnswers.includes(answer)).length;
      // Award 1 point per correct answer, subtract 1 point per incorrect answer, minimum 0
      return Math.max(0, correctCount - incorrectCount);
    });
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  const toggleDetailedAnswer = () => {
    setDetailedAnswerShown(!detailedAnswerShown);
  };

  return (
    <div className="question6-container">
      {/* Header and Progress Bar */}
      <div className="question6-progress-bar-container">
        <div className="question6-progress-bar">
          <div className="question6-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="question6-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question6-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question6-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="question6-task-header">
        <div className="question6-top-layer">
          <div className="question6-points-section">
            <h3>Challenge 6</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question6-lightning-bolt" />
            <p className="question6-points">3 points</p>
          </div>
          <div className="question6-button-container">
            <button className="question6-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="question6-task-header-question">
          <p>Faisal, a friend of Omar and Noura, has just turned 18. He recently opened his first bank account and wants to prepare for adult life — including getting a car loan or credit card in the future.</p>
          <p>He's heard that in Saudi Arabia, your credit history is tracked by 
            <span 
              className="question6-clickable-term"
              onMouseEnter={(e) => showHoverModal('SIMAH', 'The Saudi Credit Bureau (SIMAH) is Saudi Arabia\'s first licensed credit bureau. It collects and maintains credit information about individuals and companies in Saudi Arabia.', e)}
              onMouseLeave={hideHoverModal}
            > SIMAH</span> — the Saudi Credit Bureau. SIMAH collects information about your financial behaviour, like how reliably you pay bills, loans, and credit card balances.</p>
          <img src={moneyBars} alt="Task 6 Image" className="question6-task-image" />
        </div>
      </div>

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question6-hint-modal-overlay">
          <div className="question6-hint-modal">
            <h3>Hint</h3>
            <p>Think about what shows financial responsibility. Good credit scores come from showing you can use credit wisely, not from avoiding it completely or using it recklessly.</p>
            <button onClick={() => setShowHintModal(false)} className="question6-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {!showResults ? (
        <div>
          {/* Question Section */}
          <div className="question6-question-section">
            <p className="question6-question-text">Which 3 actions will actually help him build a good credit score with SIMAH?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="question6-choices-container">
            {answerOptions.map((option, index) => (
              <button key={index} className="question6-choice-button">
                {option}
              </button>
            ))}
          </div>

          {/* Team Answer Section */}
          <div className="question6-team-answer-section">
            <h4>Your answers (select exactly 3)</h4>
            <div className="question6-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question6-team-answer-box">
                  <p>{team.name}</p>
                  <div className="question6-answer-bubbles">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((letter) => (
                      <button
                        key={letter}
                        className={`question6-answer-bubble ${teamAnswers[index].includes(letter) ? 'selected' : ''}`}
                        onClick={() => handleTeamAnswerChange(index, letter)}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="question6-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question6-result-section">
          <h4>Correct Answers:</h4>
          {answerOptions.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            return (
              <p key={index} className={correctAnswers.includes(letter) ? 'question6-correct-answer' : 'question6-incorrect-answer'}>
                {option}
              </p>
            );
          })}

          <p onClick={toggleDetailedAnswer} className="question6-toggle-detailed-answer">
            Click to {detailedAnswerShown ? 'hide explanation ⬆️' : 'see explanation ⬇️'}
          </p>

          {detailedAnswerShown && (
            <div className="question6-expanded-answer">
              <h4>Why these answers are correct:</h4>
              <ul>
                <li><strong>A. Paying bills on time:</strong> Shows you're reliable — this is tracked by SIMAH.</li>
                <li><strong>D. Checking SIMAH report:</strong> Helps you catch errors that might affect your score.</li>
                <li><strong>E. Using credit responsibly:</strong> Using credit and repaying in full builds trust and keeps your utilisation ratio low.</li>
              </ul>
              <h4>Common misconceptions:</h4>
              <ul>
                <li>Using only cash (B) doesn't help build credit - you need to show you can handle credit responsibly.</li>
                <li>Applying for many cards (C) can hurt your score - each application is recorded.</li>
                <li>Savings account balance (F) isn't directly part of your credit score.</li>
                <li>Paying minimum only (G) suggests you're struggling with debt.</li>
                <li>Defaulting intentionally (H) severely damages your credit score.</li>
                <li>Ignoring credit (I) means missing opportunities to build a good history.</li>
              </ul>
            </div>
          )}

          {/* Display each team's answer with comparison */}
          <div className="question6-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question6-team-answer-box">
                <p>{team.name}</p>
                <div className="question6-answers-display">
                  {teamAnswers[index].map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className={correctAnswers.includes(answer) ? 'question6-correct' : 'question6-incorrect'}
                    >
                      {answer}
                    </div>
                  ))}
                  {teamAnswers[index].length === 0 && <div className="question6-no-answer">-</div>}
                </div>
                <p className="question6-team-score">
                  Score: {Math.max(0, 
                    teamAnswers[index].filter(answer => correctAnswers.includes(answer)).length -
                    teamAnswers[index].filter(answer => !correctAnswers.includes(answer)).length
                  )}
                </p>
              </div>
            ))}
          </div>

          <button className="question6-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question6-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question6; 