import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHourglassStart,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';

import options from '../../assets/img/options.png';
import answer from '../../assets/img/answer.png';
import fiftyFifty from '../../assets/img/50-50.png';
import hints from '../../assets/img/hints.png';

const Instructions = () => {
  return (
    <Fragment>
      <Helmet>
        <title>InQUIZitive - Instructions</title>
      </Helmet>
      <div className="instructions container">
        <h1>How to Play the Game</h1>
        <p>Ensure you read this guide from start to finish.</p>
        <ul className="browser-default" id="main-list">
          <li>
            The game has a duration of 15 minutes and ends as soon as your time
            elapses.
          </li>
          <li>Each game consists of 15 questions.</li>
          <li>
            Every question contains 4 options.
            <img src={options} alt="InQUIZiitive Options Example" />
          </li>
          <li>
            Select the option which best answers the question by clicking (or
            selecting) it.
            <img src={answer} alt="InQUIZitive Answer Example" />
          </li>
          <li>
            Each game has 2 lifelines namly:
            <ul id="sublist">
              <li>2 50-50 chances</li>
              <li>5 Hints</li>
            </ul>
          </li>
          <li>
            Selecting a 50-50 lifeline by clicking the icon{' '}
            <FontAwesomeIcon
              icon={faHourglassStart}
              size="2x"
              className="lifeline-icon"
            />{' '}
            will remove 2 wrong answers, leaving the correct answer and the one
            wrong answer.
            <img src={fiftyFifty} alt="InQUIZitive Fifty-Fifty Example" />
          </li>
          <li>
            Using a hint by clicking the icon{' '}
            <FontAwesomeIcon
              icon={faLightbulb}
              size="2x"
              className="lifeline-icon"
            />{' '}
            will remove one wrong answer leaving two wrong answers and correct
            answer. You can use as many hints as possible on a single question.
            <img src={hints} alt="InQUIZitive Hints Example" />
          </li>
          <li>
            Feel free to quit (or retire from) the game at any time. In that
            case your score will be revealed afterwards.
          </li>
          <li>The timer starts as soon as game loads.</li>
          <li>Let's do this if you think you've got what it takes?</li>
        </ul>
        <div className="button-container">
          <span className="left">
            <Link to="/">No, Take me Back.</Link>
          </span>
          <span className="right">
            <Link to="/play/quiz">Okay, Let's Do This!</Link>
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default Instructions;
