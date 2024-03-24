import OpenAI from 'openai';
import {readVariable, updateVariable} from './confighelper.js';

// Define the shape of your state

const CONFIG_KEYS = {
	OPENAI_API_KEY: 'OPENAI_API_KEY',
	TERMINAL_HEIGHT: 'TERMINAL_HEIGHT',
	TERMINAL_WIDTH: 'TERMINAL_WIDTH',
	ACTIVE_MODEL: 'ACTIVE_MODEL',
};
type ConfigType = {
	apiKey?: string;
	height: string;
	width: string;
	activeModel: string;
};

interface globalReducerState {
	config: ConfigType;
	keyPanic: boolean;
	openai: OpenAI;
}

// Define the action types
type globalReducerAction =
	| {type: 'setModel'; model: string}
	| {type: 'setKeyPanic'; keyPanic: boolean}
	| {type: 'setKey'; key: string}
	| {type: 'setTerminalHeight'; height: string}
	| {type: 'setTerminalWidth'; width: string};

// Define your initial state
const globalReducerinitialState: globalReducerState = {
	config: {
		apiKey: readVariable(CONFIG_KEYS.OPENAI_API_KEY),
		height: readVariable(CONFIG_KEYS.TERMINAL_HEIGHT) ?? '20',
		width: readVariable(CONFIG_KEYS.TERMINAL_WIDTH) ?? '100',
		activeModel: readVariable(CONFIG_KEYS.ACTIVE_MODEL) ?? 'gpt-3.5-turbo',
	},
	openai: new OpenAI({
		apiKey: readVariable(CONFIG_KEYS.OPENAI_API_KEY) ?? '',
	}),
	keyPanic: false,
};

// Define your reducer function
const globalReducer = (
	state: globalReducerState,
	action: globalReducerAction,
): globalReducerState => {
	switch (action.type) {
		case 'setKeyPanic':
			return {...state, keyPanic: action.keyPanic};
		case 'setKey':
			updateVariable(CONFIG_KEYS.OPENAI_API_KEY, action.key);
			return {
				...state,
				config: {apiKey: action.key, ...state.config},
				openai: new OpenAI({
					apiKey: action.key,
				}),
			};
		case 'setTerminalHeight':
			updateVariable(CONFIG_KEYS.TERMINAL_HEIGHT, action.height);
			return {
				...state,
				config: {...state.config, height: action.height},
			};
		case 'setTerminalWidth':
			updateVariable(CONFIG_KEYS.TERMINAL_HEIGHT, action.width);
			return {
				...state,
				config: {...state.config, width: action.width},
			};
		case 'setModel':
			updateVariable(CONFIG_KEYS.ACTIVE_MODEL, action.model);
			return {
				...state,
				config: {...state.config, activeModel: action.model},
			};
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
