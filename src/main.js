import React from 'react';
import ReactDOM from 'react-dom';

import AsciiGrid from './components/ascii.jsx';

// note: 150x50 is a large grid, more than that will not really even fit
ReactDOM.render(<AsciiGrid width={15} height={5}/>, document.getElementById('ascii-grid'));
