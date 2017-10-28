
const INITIAL_STATE = {
	name: 'user',
	status: 'usual'
}
export default (state = INITIAL_STATE, action, payload) => {
	switch (action) {
		case 'changeStatus':
			return {
				...state,
				status: payload.status
			}

		case 'rename':
			return {
				...state,
				name: payload.name
			}
	}
	return state;
}