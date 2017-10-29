import React from 'react'
import SomeComponent from '../SomeComponent'

import Store, {addReducers} from '../xstore'
import user from '../reducers/user'
import dictionary from '../reducers/dictionary'

const reducers = {
	user,
	dictionary
}

addReducers(reducers);

export default class App extends React.PureComponent {
	constructor() {
		super()
		this.state = {}
	}

	render() {
		return 	<div onClick={() => {this.setState({aaa: !this.state.aaa})}}>
		<Store has="*">
			<SomeComponent/>
			<br/>
			<br/>
			<SomeComponent/>
		</Store>
	</div>
	}
} 