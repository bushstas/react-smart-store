import React from 'react'

export default class App extends React.PureComponent {
	render() {
		return <div className="app">
			Имя: {this.props.user.name}<br/>
			Статус: {this.props.user.status}<br/>
			Лист: {this.props.dictionary.list.join(' ,')}
			<div>
				<button onClick={() => {
					this.props.dispatch('user', 'changeStatus', {status: 'killed'});
				}}>
					Kill
				</button>

				<button onClick={() => {
					this.props.dispatch('user', 'rename', {name: 'Stas'});
				}}>
					Rename
				</button>
			</div>
		</div>
	}
} 