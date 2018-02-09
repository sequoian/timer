import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './reset.css'
import './index.css'
import './display.css'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
