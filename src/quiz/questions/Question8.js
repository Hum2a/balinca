import React, { useState, useEffect } from 'react';
import './styles/Question8.css';
import lightningBolt from '../../assets/icons/Lightning Bolt.png';
import moneyBars from '../../assets/icons/moneybars.png';

const Question8 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
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

  const correctAnswer = 'B';

  const answerOptions = [
    'A. Cash, with a small discount',
    'B. Debit Card (Mada/Visa)',
    'C. Mobile Wallet (Apple Pay/STC Pay)',
    'D. Bank Transfer, but only before collecting the device',
    'E. Cheque, which will take a few days to clear'
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
    <div className="question8-container">
      {/* Header and Progress Bar */}
      <div className="question8-progress-bar-container">
        <div className="question8-progress-bar">
          <div className="question8-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="question8-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question8-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question8-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="question8-task-header">
        <div className="question8-top-layer">
          <div className="question8-points-section">
            <h3>Challenge 8</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question8-lightning-bolt" />
            <p className="question8-points">2 points</p>
          </div>
          <div className="question8-button-container">
            <button className="question8-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="question8-task-header-question">
          <p>After weeks of working hard on freelance design projects, Omar has saved up 3,500 SAR. He wants to reinvest in his work by buying a new tablet to help him design faster and more professionally.</p>
          <p>He visits a tech store in Dubai while on a short trip and is offered five ways to pay:</p>
          <img src={moneyBars} alt="Task 8 Image" className="question8-task-image" />
        </div>
      </div>

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question8-hint-modal-overlay">
          <div className="question8-hint-modal">
            <h3>Hint</h3>
            <p>Consider Omar's needs: he wants to walk out with the tablet today and needs a clear record of the purchase for business purposes. Think about which payment method best balances immediate access with proper documentation.</p>
            <button onClick={() => setShowHintModal(false)} className="question8-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {!showResults ? (
        <div>
          {/* Question Section */}
          <div className="question8-question-section">
            <p className="question8-question-text">What's the best option and why?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="question8-choices-container">
            {answerOptions.map((option, index) => (
              <button key={index} className="question8-choice-button">
                {option}
              </button>
            ))}
          </div>

          {/* Team Answer Section */}
          <div className="question8-team-answer-section">
            <h4>Your answers</h4>
            <div className="question8-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question8-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question8-answer-select"
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

          <button className="question8-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question8-result-section">
          <h4>Correct Answer:</h4>
          <p className="question8-correct-answer">B. Debit Card (Mada/Visa)</p>
          <p onClick={toggleDetailedAnswer} className="question8-toggle-detailed-answer">
            Click to {detailedAnswerShown ? 'hide explanation ⬆️' : 'see explanation ⬇️'}
          </p>

          {detailedAnswerShown && (
            <div className="question8-expanded-answer">
              <h4>Why this is the best choice:</h4>
              <div className="question8-explanation">
                <p>The debit card is the smartest choice because:</p>
                <ul>
                  <li>Provides an instant transaction</li>
                  <li>Creates a clear digital record for business expenses</li>
                  <li>Offers security and fraud protection</li>
                  <li>Links directly to his bank account</li>
                  <li>Provides an official paper trail for clients</li>
                </ul>

                <h4>Why other options are less ideal:</h4>
                <ul>
                  <li><strong>Cash (A):</strong> While it offers a discount, it provides no proof of purchase for business records</li>
                  <li><strong>Mobile Wallet (C):</strong> Similar to cards but may not provide as official a record for business purposes</li>
                  <li><strong>Bank Transfer (D):</strong> Would delay getting the tablet, which isn't ideal for a working freelancer</li>
                  <li><strong>Cheque (E):</strong> Takes days to clear, delaying access to the tablet</li>
                </ul>
              </div>
            </div>
          )}

          {/* Display each team's answer with comparison */}
          <div className="question8-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question8-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question8-correct' : 'question8-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="question8-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question8-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question8; 