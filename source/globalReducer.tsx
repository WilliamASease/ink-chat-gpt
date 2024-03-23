import OpenAI from 'openai';

// Define the shape of your state
interface globalReducerState {
	keyPanic: boolean;
	openai: OpenAI;
	activeModel: string;
}

// Define the action types
type globalReducerAction =
	| {type: 'setModel'; model: string}
	| {type: 'newOpenAI'; key: string}
	| {type: 'setKeyPanic'; keyPanic: boolean};

// Define your initial state
const globalReducerinitialState: globalReducerState = {
	openai: new OpenAI({
		apiKey: '',
	}),
	keyPanic: false,
	activeModel: 'gpt-3.5-turbo',
};

// Define your reducer function
const globalReducer = (
	state: globalReducerState,
	action: globalReducerAction,
): globalReducerState => {
	switch (action.type) {
		case 'setKeyPanic':
			return {...state, keyPanic: action.keyPanic};
		case 'newOpenAI':
			return {
				...state,
				openai: new OpenAI({
					apiKey: action.key,
				}),
			};
		case 'setModel':
			return {...state, activeModel: action.model};
		default:
			throw new Error('Unhandled action type');
	}
};

export {
	globalReducerinitialState,
	globalReducer,
	globalReducerState,
	globalReducerAction,
};
