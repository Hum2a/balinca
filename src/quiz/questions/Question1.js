import React, { useState, useEffect } from 'react';
import './Question1.css';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import q1Image from '../../../../assets/icons/q1image.png';

const Question1 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [glossaryTitle, setGlossaryTitle] = useState('');
  const [glossaryContent, setGlossaryContent] = useState('');
  const [hoverTerm, setHoverTerm] = useState(null);
  const [hoverContent, setHoverContent] = useState('');
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  const [showHoverModal, setShowHoverModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));

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
  const progressBarWidth = (timer / 180) * 100;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const showModal = (term, event) => {
    if (term === 'assets') {
      setModalTitle('Assets');
      setModalContent('Assets are things you own that have monetary value, such as cash, property, or investments.');
    } else if (term === 'liabilities') {
      setModalTitle('Liabilities');
      setModalContent('Liabilities are things you owe, such as debts or financial obligations.');
    }
    setShowHoverModal(true);

    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY - 60,
      left: rect.left + window.scrollX + 20,
    });
  };

  const hideModal = () => {
    setShowHoverModal(false);
  };

  const showDefinition = (term, event) => {
    setHoverTerm(term);
    if (term === 'assets') {
      setHoverContent('Things you own that are worth money.');
    } else if (term === 'liabilities') {
      setHoverContent('Money you owe to someone else.');
    }
    const rect = event.target.getBoundingClientRect();
    setBubblePosition({
      top: rect.top + window.scrollY - 40,
      left: rect.left + window.scrollX + 10
    });
  };

  const hideDefinition = () => {
    setHoverTerm(null);
  };

  const submitAnswers = () => {
    setShowResults(true);
    const pointsArray = teamAnswers.map(answer => (answer === correctAnswer ? 3 : 0));
    onAwardPoints(pointsArray);
  };

  const nextQuestion = () => {
    onNextQuestion();
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <div className="question1-container">
      {/* Progress Bar Container */}
      <div className="question1-progress-bar-container">
        <div className="question1-progress-bar">
          <div className="question1-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>
        
        <div className="question1-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question1-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question1-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Header */}
      <div className="question1-task-header">
        <div className="question1-header-content">
          <div className="question1-points-section">
            <h3>Challenge 1</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question1-lightning-bolt" />
            <p className="question1-points">3 points</p>
          </div>
          <div className="question1-button-container">
            <button className="question1-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <img src={q1Image} alt="Task 1 Image" className="question1-task-image" />
        <p>
          Ben is a 30 year old engineer. He has the following
          <span
            className="question1-clickable-term question1-assets-class"
            onMouseOver={(e) => showModal('assets', e)}
            onMouseLeave={hideModal}
          >
            <strong>assets</strong>
          </span>
          and
          <span
            className="question1-clickable-term question1-liabilities-class"
            onMouseOver={(e) => showModal('liabilities', e)}
            onMouseLeave={hideModal}
          >
            <strong>liabilities</strong>
          </span>.
        </p>

        {/* Hover Modal */}
        {showHoverModal && (
          <div
            className="question1-hover-modal"
            style={{ top: modalPosition.top + 'px', left: modalPosition.left + 'px' }}
          >
            <h4>{modalTitle}</h4>
            <p>{modalContent}</p>
          </div>
        )}
      </div>

      {/* Assets and Liabilities Section */}
      <div className="question1-assets-liabilities-wrapper">
        <div className="question1-assets-liabilities">
          <div className="question1-card">
            <h4>Assets</h4>
            <ul>
              <li>
                <span className="question1-asset-icon">🏠 House</span>
                <span className="question1-asset-value">£200,000</span>
              </li>
              <li>
                <span className="question1-asset-icon">🚗 Car</span>
                <span className="question1-asset-value">£50,000</span>
              </li>
              <li>
                <span className="question1-asset-icon">💵 Cash</span>
                <span className="question1-asset-value">£20,000</span>
              </li>
            </ul>
          </div>
          <div className="question1-card">
            <h4>Liabilities</h4>
            <ul>
              <li>
                <span className="question1-asset-icon">🏠 Mortgage (6%)</span>
                <span className="question1-asset-value">£150,000</span>
              </li>
              <li>
                <span className="question1-asset-icon">🚗 Car Loan (10%)</span>
                <span className="question1-asset-value">£20,000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {showResults ? (
        <div className="question1-result-section">
          <h4>Correct Answer:</h4>
          <p className="question1-correct-answer">£100,000</p>
          <p className="question1-correct-answer-description">Net Worth is</p>
          <p className="question1-correct-answer-description"><strong>Total Assets – Total Liabilities</strong></p>
          <p className="question1-correct-answer-description">£270,000 - £170,000</p>
          <h4 className="question1-your-answers">Your answers</h4>

          <div className="question1-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question1-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question1-correct' : 'question1-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="question1-next-button" onClick={nextQuestion}>Next</button>
        </div>
      ) : (
        <div>
          {/* Question Section */}
          <div className="question1-question-section">
            <p className="question1-question">What is his net worth?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="question1-choices-container">
            <button className="question1-choice-button">A. £20,000</button>
            <button className="question1-choice-button">B. £50,000</button>
            <button className="question1-choice-button">C. £100,000</button>
            <button className="question1-choice-button">D. £270,000</button>
            <button className="question1-choice-button">E. £440,000</button>
          </div>

          {/* Team Answer Section */}
          <div className="question1-team-answer-section">
            <h4>Your answers</h4>
            <div className="question1-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question1-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question1-answer-select"
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

          {/* Submit Button */}
          <button className="question1-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question1-hint-modal-overlay">
          <div className="question1-hint-modal">
            <h3>Hint</h3>
            <p>Net worth = Total Assets – Total Liabilities</p>
            <button onClick={() => setShowHintModal(false)} className="question1-close-modal-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question1; 