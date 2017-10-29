import React from 'react'

const provider  = new class {
	
	constructor(reducers) {    
		this.storages = new Map();
		this.subscribers = new Map();
		this.subscribersToAll = [];
		this.reducers = {};
		this.keys = new Map();
	}

	addReducers(reducers) {
		if (reducers instanceof Object) {
			for (let name in reducers) {
				if (reducers[name] instanceof Function && !this.reducers[name]) {
					this.reducers[name] = reducers[name];
					let action = this.getAction(name);
					this.storages.set(name, action()|| {});
					this.distributeChanges(name);
				}
			}
		}
	}

	getAction(name) {
		return this.reducers[name];
	}

	getFor(component) {
		let keys = this.keys.get(component);
		if (keys === '*') {
			keys = []; 
			this.storages.forEach((v, name) => {
				keys.push(name);
			});
		}
		const data = {};
		if (keys instanceof Array) {
			keys.forEach(name => {
				name = name.trim();
				data[name] = this.storages.get(name) || {};
			});
		}
		return data;
	}
	
	subscribe(component, use, reducers) {
		if (use === '*') {
			this.subscribersToAll.push(component);
			this.keys.set(component, '*');
		} else if (typeof use == 'string') {
			use = use.split(',');
		}
		if (use instanceof Array) {
			this.keys.set(component, use);
			use.forEach(name => {
				if (typeof name == 'string') {
					name = name.trim();
					let subscribers = this.subscribers.get(name) || [];
					subscribers.push(component);
					this.subscribers.set(name, subscribers);					
				}
			});
		}
		this.addReducers(reducers);
		let newState = this.getFor(component);
		component.state = newState;
	}

	unsubscribe(component) {
		let keys = this.keys.get(component);
		if (keys instanceof Array) {
			keys.forEach(name => {
				let subscribers = this.subscribers.get(name);
				if (subscribers instanceof Array) {
					let idx = subscribers.indexOf(component);
					if (idx > -1) {
						subscribers.splice(idx, 1);
						this.subscribers.set(name, subscribers);
					}
				}
			});
		} else if (keys === '*') {
			let idx = this.subscribersToAll.indexOf(component);
			if (idx > -1) {
				this.subscribersToAll.splice(idx, 1);
			}
		}
		this.keys.delete(component);
	}

	dispatch(name, action, payload) {
		let rd = this.reducers[name];
		if (rd instanceof Function) {
			const newState = this.getAction(name)(
				this.storages.get(name),
				action,
				payload
			);
			this.storages.set(name, newState);
			this.distributeChanges(name);
		}
	}

	distributeChanges(name) {
		let subscribers = this.subscribers.get(name);
		if (subscribers instanceof Array) {
			subscribers.forEach(sb => {
				let newState = this.getFor(sb);
				if (sb.isReady()) {
					sb.setState(newState);
				} else {
					sb.state = newState;
				}
			});
		}
		this.subscribersToAll.forEach(sb => {
			let newState = this.getFor(sb);
			if (sb.isReady()) {
				sb.setState(newState);
			} else {
				sb.state = newState;
			}
		});
	}
};


export default class XStoreContainer extends React.PureComponent {
	constructor(props) {
		super();
		let {has, reducers} = props;
		if (!has && reducers instanceof Object) {
			has = Object.keys(reducers);
		}
		provider.subscribe(
			this,
			has,
			reducers
		);
	}

	componentWillMount() {
		this._ready = true;
	}

	componentWillUnmount() {
		this._ready = false;
		provider.unsubscribe(this);
	}

	isReady() {
		return this._ready;
	}

	render() {
		let {children, shouldHave: sh} = this.props;
		if (!(children instanceof Array)) {
			children = [children];
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
		return children.map((c, key) => {
			if (c.type instanceof Function) {
				let props = {
					key,
					dispatch,
					...this.state
				};
				return React.cloneElement(
					c, 
					props, 
					c.props.children
				);
			}
			return c;
		});
	}
} 

export const addReducers = (reducers) => {
	provider.addReducers(reducers);
}

export const dispatch = (...args) => {
	provider.dispatch(...args);
}


