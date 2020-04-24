import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default class Summary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      score: 0,
      numberOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      hintsUsed: 0,
      fiftyFiftyUsed: 0,
    };
  }

  componentDidMount() {
    const { state } = this.props.location;

    this.setState({
      questions: state.questions,
      score: (state.score / state.numberOfQuestions) * 100,
      numberOfQuestions: state.numberOfQuestions,
      numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
      correctAnswers: state.correctAnswers,
      incorrectAnswers: state.incorrectAnswers,
      hintsUsed: state.hintsUsed,
      fiftyFiftyUsed: state.fiftyFiftyUsed,
    });
  }

  handleReviewButton = () => {
    this.props.history.push('/play/review', this.state.questions);
  };

  render() {
    const { state } = this.props.location;
    let stats, remark;

    const userScore = this.state.score;

    if (userScore <= 30) {
      remark = 'You need more practice!';
    } else if (userScore > 30 && userScore <= 50) {
      remark = 'Better luck next time!';
    } else if (userScore <= 70 && userScore > 50) {
      remark = 'You can do better!';
    } else if (userScore >= 71 && userScore <= 84) {
      remark = 'You did great!';
    } else {
      remark = "You're an absolute genius!";
    }

    if (state !== undefined) {
      stats = (
        <Fragment>
          <div className="success-icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <h1>Congratulations, you made it!</h1>
          <div className="container stats">
            <div className="button-container">
              <button onClick={this.handleReviewButton}>
                View Answer Sheet
              </button>
            </div>
            <h4>{remark}</h4>
            <h2>Your Score: {this.state.score.toFixed(0)}&#37;</h2>
            <span className="stat left">Total Number of Questions:</span>
            <span className="right">{this.state.numberOfQuestions}</span>
            <br />

            <span className="stat left">Number of Attempted Questions:</span>
            <span className="right">
              {this.state.numberOfAnsweredQuestions}
            </span>
            <br />

            <span className="stat left">Number of Correct Questions:</span>
            <span className="right">{this.state.correctAnswers}</span>
            <br />

            <span className="stat left">Number of Incorrect Answers:</span>
            <span className="right">{this.state.incorrectAnswers}</span>
            <br />

            <span className="stat left">Hints Used:</span>
            <span className="right">{this.state.hintsUsed}</span>
            <br />

            <span className="stat left">50-50 Used:</span>
            <span className="right">{this.state.fiftyFiftyUsed}</span>
          </div>
          <section>
            <ul>
              <li>
                <Link to="/">Back to Home</Link>
              </li>
              <li>
                <Link to="/play/quiz">Play Again</Link>
              </li>
            </ul>
          </section>
        </Fragment>
      );
    } else {
      stats = (
        <section>
          <h1 className="no-stats">No Statistics Available!</h1>
          <ul>
            <li>
              <Link to="/">Back to Home</Link>
            </li>
            <li>
              <Link to="/play/quiz">Play Again</Link>
            </li>
          </ul>
        </section>
      );
    }

    return (
      <Fragment>
        <Helmet>
          <title>InQUIZitive - Summary</title>
        </Helmet>
        <div className="summary">{stats}</div>
      </Fragment>
    );
  }
}
