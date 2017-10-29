import React from 'react'

export default function SomeComponent (props) {
	
		return <div className="app">
			Имя: {props.user.name}<br/>
			Статус: {props.user.status}<br/>
			Лист: {props.dictionary.list}<br/>
			
			<div>
				<button onClick={() => {
					props.dispatch('user', 'changeStatus', {status: 'killed'});
				}}>
					Kill
				</button>

				<button onClick={() => {
					props.dispatch('user', 'rename', {name: 'Stas'});
				}}>
					Rename
				</button>
			</div>
		</div>
} 