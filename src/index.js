import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {dispatch} from './xstore'


setTimeout(() => {
	dispatch('dictionary', 'loaded', {list: [1,2,3,4,5]})
	dispatch('user', 'rename', {name: 'John'})
}, 5000);

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);


