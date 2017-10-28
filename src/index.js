import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import Store, {addReducers, dispatch} from 'xstore'
import user from './reducers/user'
import dictionary from './reducers/dictionary'

addReducers({
	user,
	dictionary
});

setTimeout(() => {
	dispatch('dictionary', 'loaded', {list: [1,2,3,4,5]})
	dispatch('user', 'rename', {name: 'John'})
}, 2000);

ReactDOM.render(
	<Store has="user, dictionary" shouldHave="dictionary">
		<App/>
	</Store>,
	document.getElementById('root')
);


