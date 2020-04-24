import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';
import Instructions from './components/quiz/Instructions';
import Play from './components/quiz/Play';
import Summary from './components/quiz/Summary';
import Review from './components/quiz/Review';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/play/instructions" exact component={Instructions} />
      <Route path="/play/quiz" exact component={Play} />
      <Route path="/play/summary" exact component={Summary} />
      <Route path="/play/review" exact component={Review} />
    </Router>
  );
}

export default App;
