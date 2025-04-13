import React, { useState } from 'react';
import './styles/Question0.css';

const Question0 = ({ onNextQuestion }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  const handleContinue = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onNextQuestion();
    }, 500);
  };

  return (
    <div className={`question0-container ${isAnimating ? 'fade-in' : 'fade-out'}`}>
      <div className="question0-content">
        <h1 className="question0-title">Balinca Financial Literacy Game – Saudi</h1>
        
        <div className="question0-scene">
          <div className="question0-characters">
            <div className="question0-character omar">
              <div className="question0-avatar omar-avatar"></div>
              <h3>Omar</h3>
              <p>17-year-old student in Jeddah</p>
              {/* <ul>
                <li>Inherited an apartment</li>
                <li>Works part-time at a media agency</li>
              </ul> */}
            </div>

            <div className="question0-character noura">
              <div className="question0-avatar noura-avatar"></div>
              <h3>Noura</h3>
              <p>17-year-old student in Jeddah</p>
              {/* <ul>
                <li>Earns from tutoring</li>
                <li>Interested in early investing</li>
              </ul> */}
            </div>
          </div>

          <div className="question0-story">
            <p>
              Omar and Noura are both 17-year-old students living in Jeddah. Omar recently inherited 
              an apartment from his grandfather and has a part-time job at a local media agency. 
              Noura has been earning money from tutoring and wants to start investing early.
            </p>
            <p className="question0-challenge">
              They have a conversation around the key financial decisions they need to make. 
              Help them to make the right financial choices.
            </p>
          </div>
        </div>

        <button className="question0-continue-btn" onClick={handleContinue}>
          Begin Their Journey
          <span className="question0-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default Question0;
