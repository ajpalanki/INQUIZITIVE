import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionsBank: [],
    };
  }

  componentDidMount() {
    const { state } = this.props.location;

    this.setState({
      questionsBank: state,
    });
  }

  render() {
    const { questionsBank } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>InQUIZitive - Review Scores</title>
        </Helmet>
        <h1>Answer Sheet</h1>
        <div className="row">
          {questionsBank.map((question) => (
            <div key={question.id} className="column">
              <div className="card">
                <h6>
                  <span style={{ fontWeight: 'bold' }}>Que:</span>{' '}
                  {question.question}
                </h6>
                <ul>
                  {question.options.map((option) => (
                    <li
                      key={option}
                      style={{
                        backgroundColor:
                          option === question.answer ? '#57b846' : '',
                        color: option === question.answer ? '#fff' : '',
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
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
  }
}
