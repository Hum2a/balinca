import React, { useState, useEffect } from 'react';
import './styles/Question2.css';
import lightningBolt from '../../assets/icons/Lightning Bolt.png';

const Question2 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [showExpandedAnswer, setShowExpandedAnswer] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
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
    if (term === 'incomeTax') {
      setGlossaryTitle('Income Tax');
      setGlossaryContent('A portion of the money that people earn from their jobs or other places, which they need to give to the government. This money helps pay for things like schools, roads, and hospitals.');
    } else if (term === 'taxRate') {
      setGlossaryTitle('Tax Rate');
      setGlossaryContent("This tells you how much income tax you need to pay. It's like a rule that says how much money you give to the government based on how much money you make.");
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map(answer => (answer === correctAnswer ? 2 : 0));
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  const toggleExpandedAnswer = () => {
    setShowExpandedAnswer(prev => !prev);
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <div className="question2-container">
      {/* Header and Progress Bar */}
      <div className="question2-progress-bar-container">
        <div className="question2-progress-bar">
          <div className="question2-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="question2-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question2-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question2-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="question2-task-header">
        <div className="question2-header-content">
          <div className="question2-points-section">
            <h3>Challenge 2</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question2-lightning-bolt" />
            <p className="question2-points">2 points</p>
          </div>
          <div className="question2-button-container">
            <button className="question2-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <p>
          Noura saved 1,000 SAR in cash last year to buy a new phone. She didn't spend any of it, but when she checks the price this year, she finds the same phone now costs 1,100 SAR.
        </p>
        <p>
          She's confused — she saved carefully, so why isn't it enough anymore?
        </p>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="question2-glossary-sidebar">
          <div className="question2-glossary-header">
            <h2>{glossaryTitle}</h2>
            <button className="question2-close-button" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div className="question2-glossary-content">
            <p>{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question2-hint-modal-overlay">
          <div className="question2-hint-modal">
            <h3>Hint</h3>
            <p>Think about what happens to the value of money over time. When prices go up generally across the economy, what do we call that?</p>
            <p>Consider how this affects the purchasing power of saved money.</p>
            <button onClick={() => setShowHintModal(false)} className="question2-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Tax Information Table */}
      <div className="question2-tax-info-table">
        <table>
          <thead>
            <tr>
              <th>Income</th>
              <th>
                <span 
                  className="question2-clickable-term" 
                  onMouseOver={(e) => showHoverModal('Tax Rate', "This tells you how much income tax you need to pay. It's like a rule that says how much money you give to the government based on how much money you make.", e)}
                  onMouseLeave={hideHoverModal}
                >
                  <strong>Tax Rate</strong>
                </span>
              </th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>£0 - £10,000</td>
              <td><span className="question2-tax-rate question2-tax-0">0%</span></td>
              <td>The first 10k is tax-free</td>
            </tr>
            <tr>
              <td>£10,000 - £40,000</td>
              <td><span className="question2-tax-rate question2-tax-20">20%</span></td>
              <td>You pay 20% tax on the money IN THIS BRACKET only</td>
            </tr>
            <tr>
              <td>£40,000 - £100,000</td>
              <td><span className="question2-tax-rate question2-tax-40">40%</span></td>
              <td>You pay 40% tax on the money IN THIS BRACKET only</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question2-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}

      {/* Conditionally display answer options or result section */}
      {!showResults ? (
        <div>
          {/* Question and Points Section */}
          <div className="question2-question-section">
            <p>What's really happened here, and what lesson can Noura learn for the future?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="question2-choices-container">
            <button className="question2-choice-button">A. The phone company increased prices randomly — next year it might go back down</button>
            <button className="question2-choice-button">B. She should have saved more — saving 1,000 SAR wasn't enough from the beginning</button>
            <button className="question2-choice-button">C. Prices went up because of inflation - her money lost value over time while just sitting there</button>
            <button className="question2-choice-button">D. Inflation doesn't affect savings — she just waited too long to buy</button>
            <button className="question2-choice-button">E. Inflation helps savers, not spenders — so its good that she saved her money</button>
          </div>

          {/* Team Answer Section */}
          <div className="question2-team-answer-section">
            <h4>Your answers</h4>
            <div className="question2-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question2-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question2-answer-select"
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
          <button className="question2-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question2-result-section">
          <h4>Correct Answer:</h4>
          <p className="question2-correct-answer">C. Prices went up because of inflation - her money lost value over time while just sitting there</p>
          <p onClick={toggleExpandedAnswer} className="question2-detailed-answer-toggle">
            Click to see detailed explanation
            <span>{showExpandedAnswer ? '⬆️' : '⬇️'}</span>
          </p>

          {/* Expanded Answer (Detailed Explanation) */}
          {showExpandedAnswer && (
            <div className="question2-expanded-answer">
              <h4>Why this matters:</h4>
              <p>This example teaches us an important lesson about inflation and how it affects our savings:</p>
              <ul>
                <li>Inflation is when prices generally rise over time across the economy</li>
                <li>When money sits as cash, its purchasing power (what you can buy with it) decreases</li>
                <li>In this case, the same phone costs 100 SAR more (a 10% increase) after just one year</li>
                <li>To protect against inflation, it's important to consider ways to grow your savings, not just store them</li>
              </ul>
            </div>
          )}

          {/* Display each team's answer with comparison */}
          <div className="question2-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question2-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question2-correct' : 'question2-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="question2-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Question2; 