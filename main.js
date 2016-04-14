// initially cobbled together from
// https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement
// and
// https://www.twilio.com/blog/2015/08/setting-up-react-for-es6-with-webpack-and-babel-2.html
import React from 'react';
import ReactDOM from 'react-dom';

import AsciiGrid from './ascii.jsx';

// note: 150x50 is a large grid, more than that will not really even fit
ReactDOM.render(<AsciiGrid width={15} height={5}/>, document.getElementById('ascii-grid'));
