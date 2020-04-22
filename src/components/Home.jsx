import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';

const Home = () => (
  <Fragment>
    <Helmet>
      <title>InQUIZitive - Home</title>
    </Helmet>
    <div id="home">
      <section>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <FontAwesomeIcon icon={faCube} className="cube" />
        </div>
        <h1>InQUIZitive</h1>
        <div className="play-button-container">
          <ul>
            <li>
              <Link className="play-button" to="/play/instructions">
                Play
              </Link>
            </li>
          </ul>
        </div>
        {/* <div className="auth-container">
          <Link className="auth-buttons" to="/login" id="login-button">
            Login
          </Link>
          <Link className="auth-buttons" to="/register" id="register-button">
            Register
          </Link>
        </div> */}
      </section>
    </div>
  </Fragment>
);

export default Home;
