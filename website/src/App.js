import Background from './Background.js';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  return (
    <body>
      <Background>
        <Router>
          <Route path="/" element={<Home />} />
        </Router>
      </Background>
    </body>
  );
}

export default App;
