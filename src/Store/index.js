import React from 'react'

const provider  = new class {
	
	constructor(reducers) {
		this.storages = new Map();
		this.subscribers = new Map();
		this.reducers = {};
		this.keys = new Map();
	}

	addReducers(reducers) {
		this.reducers = {
			...this.reducers,
			...reducers
		};
	}

	getFor(component) {
		const keys = this.keys.get(component);
		let data = {};
		if (keys instanceof Array) {
			keys.forEach(item => {
				item = item.trim();
				data[item] = this.storages.get(item);
			});
		}
		return data;
	}
	
	subscribe(component, use) {
		if (typeof use == 'string') {
			use = use.split(',');
		}
		if (use instanceof Array) {
			this.keys.set(component, use);
			use.forEach(item => {
				if (typeof item == 'string') {
					item = item.trim();
					let subscribers = this.getSubscribers(item);
					subscribers.push(component);
					this.subscribers.set(item, subscribers);
					let rd = this.reducers[item];
					if (rd instanceof Function) {
						this.storages.set(item, rd());
					}
				}
			});
		}
		component.state = this.getFor(component);
	}

	getSubscribers(name) {
		return this.subscribers.get(name) || [];
	}

	dispatch(name, action, payload) {
		let rd = this.reducers[name];
		if (rd instanceof Function) {
			const newState = rd(
				this.storages.get(name),
				action,
				payload
			);
			this.storages.set(name, newState);
			let subscribers = this.getSubscribers(name);
			if (subscribers instanceof Array) {
				subscribers.forEach(sb => {
					sb.setState(this.getFor(sb));
				})
			}
		}
	}
};


export default class Store extends React.PureComponent {
	constructor(props) {
		super();
		provider.subscribe(this, props.has);
	}

	render() {
		let {children: c, shouldHave: sh} = this.props;
		if (c instanceof Array) {
			c = c[0];
		}
		if (sh) {
			if (typeof sh == 'string') {
				sh = sh.split(',');
				for (let i = 0; i < sh.length; i++) {
					let item = sh[i];
					if (typeof item == 'string') {
						item = item.trim();
						if (!this.state[item]) {
							return null;
						}
					}
				}
			}
		}
		if (c.type instanceof Function) {
			return React.cloneElement(
				c, 
				{dispatch, ...this.state}, 
				c.props.children
			);
		}
		return null;
	}
} 

export const addReducers = (reducers) => {
	provider.addReducers(reducers);
}

export const dispatch = (...args) => {
	provider.dispatch(...args);
}


