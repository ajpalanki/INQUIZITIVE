import React, { Component, Fragment } from 'react';
import axios from 'axios';
import M from 'materialize-css';
// import cx from 'classnames';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHourglassStart,
  faLightbulb,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

import isEmpty from '../../utils/is-empty';
import correctNotification from '../../assets/audio/correct-sound.mp3';
import incorrectNotification from '../../assets/audio/incorrect-sound.mp3';
import buttonSound from '../../assets/audio/button-sound.mp3';

const url = 'https://opentdb.com/api.php?amount=15&type=multiple';

function decodeString(string) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = string;
  return textArea.value;
}

export default class Play extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      answer: '',
      numberOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      hints: 5,
      fiftyFifty: 2,
      usedFiftyFifty: false,
      nextButtonDisabled: false,
      previousButtonDisabled: true,
      previousRandomNumbers: [],
      time: {},
    };
    this.interval = null;
    this.correctSound = React.createRef();
    this.incorrectSound = React.createRef();
    this.buttonSound = React.createRef();
  }

  async componentDidMount() {
    let resultsFromAPI = [];
    await axios.get(url).then((res) => {
      res.data.results.map((item, index) => {
        const answer = decodeString(item.correct_answer);
        const options = [
          ...item.incorrect_answers.map((a) => decodeString(a)),
          answer,
        ];
        return resultsFromAPI.push({
          id: index,
          category: item.category,
          question: decodeString(item.question),
          answer: answer,
          options: options.sort(() => Math.random() - 0.5),
        });
      });
    });
    this.setState({ questions: resultsFromAPI });

    const {
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion,
    } = this.state;
    this.displayQuestions(
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
    );

    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  displayQuestions = (
    questions,
    currentQuestion,
    nextQuestion,
    previousQuestion
  ) => {
    let { currentQuestionIndex } = this.state;

    if (!isEmpty(this.state.questions)) {
      questions = this.state.questions;
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestionIndex - 1];
      const answer = currentQuestion.answer;

      this.setState(
        {
          currentQuestion,
          nextQuestion,
          previousQuestion,
          numberOfQuestions: questions.length,
          answer,
          previousRandomNumbers: [],
        },
        () => {
          this.showOptions();
          this.handleDisablingOfButtons();
        }
      );
    }
  };

  handleOption = (event) => {
    if (
      event.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()
    ) {
      this.correctSound.current.play();
      this.correctAnswer();
    } else {
      this.incorrectSound.current.play();
      this.incorrectAnswer();
    }
  };

  handlePreviousButton = () => {
    this.playButtonSound();
    if (this.state.previousQuestion !== undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex - 1,
        }),
        () => {
          const {
            questions,
            currentQuestion,
            nextQuestion,
            previousQuestion,
          } = this.state;
          this.displayQuestions(
            questions,
            currentQuestion,
            nextQuestion,
            previousQuestion
          );
        }
      );
    }
  };

  handleNextButton = () => {
    this.playButtonSound();
    if (this.state.nextQuestion !== undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
        }),
        () => {
          const {
            questions,
            currentQuestion,
            nextQuestion,
            previousQuestion,
          } = this.state;
          this.displayQuestions(
            questions,
            currentQuestion,
            nextQuestion,
            previousQuestion
          );
        }
      );
    }
  };

  handleQuitButton = () => {
    this.playButtonSound();
    if (window.confirm('Are you sure you want to quit?')) {
      this.props.history.push('/');
    }
  };

  handleButton = (event) => {
    switch (event.target.id) {
      case 'next-button':
        this.handleNextButton();
        break;
      case 'previous-button':
        this.handlePreviousButton();
        break;
      case 'quit-button':
        this.handleQuitButton();
        break;
      default:
        break;
    }
  };

  playButtonSound = () => {
    this.buttonSound.current.play();
  };

  correctAnswer = () => {
    M.toast({
      html: 'Correct Answer!',
      classes: 'toast-valid',
      displayLength: 1500,
    });

    this.setState(
      (prevState) => ({
        score: prevState.score + 1,
        correctAnswers: prevState.correctAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      () => {
        const {
          questions,
          currentQuestion,
          nextQuestion,
          previousQuestion,
        } = this.state;

        if (nextQuestion === undefined) {
          this.endGame();
        } else {
          this.displayQuestions(
            questions,
            currentQuestion,
            nextQuestion,
            previousQuestion
          );
        }
      }
    );
  };

  incorrectAnswer = () => {
    navigator.vibrate(1000);
    M.toast({
      html: 'Incorrect Answer!',
      classes: 'toast-invalid',
      displayLength: 1500,
    });

    this.setState(
      (prevState) => ({
        incorrectAnswers: prevState.incorrectAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      () => {
        const {
          questions,
          currentQuestion,
          nextQuestion,
          previousQuestion,
        } = this.state;

        if (nextQuestion === undefined) {
          this.endGame();
        } else {
          this.displayQuestions(
            questions,
            currentQuestion,
            nextQuestion,
            previousQuestion
          );
        }
      }
    );
  };

  showOptions = () => {
    const options = Array.from(document.querySelectorAll('.option'));

    options.forEach((option) => {
      option.style.visibility = 'visible';
    });

    this.setState({
      usedFiftyFifty: false,
    });
  };

  handleHints = () => {
    if (this.state.hints > 0) {
      const options = Array.from(document.querySelectorAll('.option'));
      let indexOfAnswer;

      options.forEach((option, i) => {
        if (
          option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()
        ) {
          indexOfAnswer = i;
        }
      });

      while (true) {
        const randomNumber = Math.round(Math.random() * 3);

        if (
          randomNumber !== indexOfAnswer &&
          !this.state.previousRandomNumbers.includes(randomNumber)
        ) {
          options.forEach((option, i) => {
            if (i === randomNumber) {
              option.style.visibility = 'hidden';
              this.setState((prevState) => ({
                hints: prevState.hints - 1,
                previousRandomNumbers: prevState.previousRandomNumbers.concat(
                  randomNumber
                ),
              }));
            }
          });
          break;
        }
        if (this.state.previousRandomNumbers.length >= 3) break;
      }
    }
  };

  handlFiftyFifty = () => {
    if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
      const options = document.querySelectorAll('.option');
      const randomNumbers = [];
      let indexOfAnswer;

      options.forEach((option, i) => {
        if (
          option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()
        ) {
          indexOfAnswer = i;
        }
      });

      let count = 0;
      do {
        const randomNumber = Math.round(Math.random() * 3);
        if (randomNumber !== indexOfAnswer) {
          if (
            randomNumbers.length < 2 &&
            !randomNumbers.includes(randomNumber) &&
            !randomNumbers.includes(indexOfAnswer)
          ) {
            randomNumbers.push(randomNumber);
            count++;
          } else {
            while (true) {
              const newRandomNumber = Math.round(Math.random() * 3);
              if (
                !randomNumbers.includes(newRandomNumber) &&
                !randomNumbers.includes(indexOfAnswer)
              ) {
                randomNumbers.push(newRandomNumber);
                count++;
                break;
              }
            }
          }
        }
      } while (count < 2);
      options.forEach((option, i) => {
        if (randomNumbers.includes(i)) {
          option.style.visibility = 'hidden';
        }
      });

      this.setState((prevState) => ({
        fiftyFifty: prevState.fiftyFifty - 1,
        usedFiftyFifty: true,
      }));
    }
  };

  startTimer = () => {
    const countDownTime = Date.now() + 180000;
    this.interval = setInterval(() => {
      const now = new Date();
      const distance = countDownTime - now;

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(this.interval);
        this.setState(
          {
            time: {
              minutes: 0,
              seconds: 0,
            },
          },
          () => {
            this.endGame();
          }
        );
      } else {
        this.setState({
          time: {
            minutes,
            seconds,
          },
        });
      }
    }, 1000);
  };

  handleDisablingOfButtons = () => {
    if (
      this.state.previousQuestion === undefined ||
      this.state.currentQuestionIndex === 0
    ) {
      this.setState({
        previousButtonDisabled: true,
      });
    } else {
      this.setState({
        previousButtonDisabled: false,
      });
    }

    if (
      this.state.nextQuestion === undefined ||
      this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions
    ) {
      this.setState({
        nextButtonDisabled: true,
      });
    } else {
      this.setState({
        nextButtonDisabled: false,
      });
    }
  };

  endGame = () => {
    const {
      questions,
      score,
      numberOfQuestions,
      correctAnswers,
      incorrectAnswers,
      fiftyFifty,
      hints,
    } = this.state;
    const playerStats = {
      questions,
      score,
      numberOfQuestions,
      numberOfAnsweredQuestions: correctAnswers + incorrectAnswers,
      correctAnswers,
      incorrectAnswers,
      fiftyFiftyUsed: 2 - fiftyFifty,
      hintsUsed: 5 - hints,
    };

    setTimeout(() => {
      this.props.history.push('/play/summary', playerStats);
    }, 1000);
  };

  render() {
    const {
      currentQuestion,
      currentQuestionIndex,
      numberOfQuestions,
      hints,
      fiftyFifty,
      time,
    } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>InQUIZitive - QUIZ</title>
        </Helmet>
        <Fragment>
          <audio ref={this.correctSound} src={correctNotification}></audio>
          <audio ref={this.incorrectSound} src={incorrectNotification}></audio>
          <audio ref={this.buttonSound} src={buttonSound}></audio>
        </Fragment>
        {currentQuestion !== undefined ? (
          <div className="questions">
            <h4>{currentQuestion.category}</h4>
            <div className="lifeline-container">
              <p onClick={this.handlFiftyFifty} className="lifeline-icon">
                <FontAwesomeIcon icon={faHourglassStart}></FontAwesomeIcon>{' '}
                <span className="lifeline">{fiftyFifty}</span>
              </p>
              <p onClick={this.handleHints} className="lifeline-icon">
                <FontAwesomeIcon icon={faLightbulb}></FontAwesomeIcon>{' '}
                <span className="lifeline">{hints}</span>
              </p>
            </div>

            <div className="timer-container">
              <p>
                <span className="left">
                  {currentQuestionIndex + 1} of {numberOfQuestions}
                </span>
                <span className="right">
                  {time.minutes}:{time.seconds}{' '}
                  <FontAwesomeIcon icon={faClock} />
                </span>
              </p>
            </div>

            <h5>{currentQuestion.question}</h5>

            {currentQuestion.options !== undefined ? (
              <Fragment>
                <div className="options-container">
                  <p onClick={this.handleOption} className="option">
                    {currentQuestion.options[0]}
                  </p>
                  <p onClick={this.handleOption} className="option">
                    {currentQuestion.options[1]}
                  </p>
                </div>

                <div className="options-container">
                  <p onClick={this.handleOption} className="option">
                    {currentQuestion.options[2]}
                  </p>
                  <p onClick={this.handleOption} className="option">
                    {currentQuestion.options[3]}
                  </p>
                </div>
              </Fragment>
            ) : null}

            <div className="button-container">
              {/* <button
                className={cx('', { disable: previousButtonDisabled })}
                id="previous-button"
                onClick={this.handleButton}
              >
                Previous
              </button>
              <button
                className={cx('', { disable: nextButtonDisabled })}
                id="next-button"
                onClick={this.handleButton}
              >
                Next
              </button> */}
              <button id="quit-button" onClick={this.handleButton}>
                Quit
              </button>
            </div>
          </div>
        ) : null}
      </Fragment>
    );
  }
}
