// cobbled together from
// https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement
// and
// https://www.twilio.com/blog/2015/08/setting-up-react-for-es6-with-webpack-and-babel-2.html
import React from 'react';
import ReactDOM from 'react-dom';

import Hello from './hello.jsx';
import World from './world.jsx';
import AsciiGrid from './ascii.jsx';

ReactDOM.render(<Hello/>, document.getElementById('hello'));
ReactDOM.render(<World/>, document.getElementById('world'));
ReactDOM.render(<AsciiGrid width={15} height={10}/>, document.getElementById('ascii-grid'));
