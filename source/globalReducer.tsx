import OpenAI from 'openai';
import {deleteVariable, readVariable, updateVariable} from './confighelper.js';
import {ForegroundColorName} from 'chalk';

// Define the shape of your state

const CONFIG_KEYS = {
	OPENAI_API_KEY: 'OPENAI_API_KEY',
	TERMINAL_HEIGHT: 'TERMINAL_HEIGHT',
	TERMINAL_WIDTH: 'TERMINAL_WIDTH',
	ACTIVE_MODEL: 'ACTIVE_MODEL',
	LOGGING_ENABLE: 'LOGGING_ENABLE',
	LOGGING_FILE_MODE: 'LOGGING_FILE_MODE',
	OUTPUT_DIRECTORY: 'OUTPUT_DIRECTORY',
};

const COLOR_KEYS = {
	OUTER_FRAME_COLOR: 'OUTER_FRAME_COLOR',
	INNER_FRAME_COLOR: 'INNER_FRAME_COLOR',
	TAB_BAR_COLOR: 'TAB_BAR_COLOR',
	YOUR_COLOR: 'YOUR_COLOR',
	MODEL_COLOR: 'MODEL_COLOR',
};
const colors: ForegroundColorName[] = [
	'black',
	'blackBright',
	'blue',
	'blueBright',
	'cyan',
	'cyanBright',
	'gray',
	'green',
	'greenBright',
	'grey',
	'magenta',
	'magentaBright',
	'red',
	'redBright',
	'white',
	'whiteBright',
	'yellow',
	'yellowBright',
];
const cycleColor = (current: string) =>
	colors[(colors.findIndex(fgc => fgc === current) + 1) % colors.length] ?? '';

type ConfigType = {
	apiKey?: string;
	height: string;
	width: string;
	activeModel: string;
	loggingEnable: boolean;
	loggingMode: 'oneFile' | 'manyFiles';
	outputDirectory: string;
	colorMap: {
		outerFrame: string;
		innerFrame: string;
		tabBar: string;
		you: string;
		model: string;
	};
};

interface globalReducerState {
	config: ConfigType;
	keyPanic: boolean;
	openai: OpenAI;
}

// Define your initial state
const globalReducerinitialState: globalReducerState = {
	config: {
		apiKey: readVariable(CONFIG_KEYS.OPENAI_API_KEY),
		height: readVariable(CONFIG_KEYS.TERMINAL_HEIGHT) ?? '20',
		width: readVariable(CONFIG_KEYS.TERMINAL_WIDTH) ?? '100',
		activeModel: readVariable(CONFIG_KEYS.ACTIVE_MODEL) ?? 'gpt-3.5-turbo',
		loggingEnable: readVariable(CONFIG_KEYS.ACTIVE_MODEL) === 'true' ?? true,
		loggingMode:
			(readVariable(CONFIG_KEYS.ACTIVE_MODEL) as
				| 'oneFile'
				| 'manyFiles'
				| undefined) ?? 'oneFile',
		outputDirectory:
			readVariable(CONFIG_KEYS.OUTPUT_DIRECTORY) ??
			`C:\\Users\\${process.env['USERNAME']}\\Documents\\OpenAI`,

		colorMap: {
			outerFrame: readVariable(COLOR_KEYS.OUTER_FRAME_COLOR) ?? 'green',
			innerFrame: readVariable(COLOR_KEYS.INNER_FRAME_COLOR) ?? 'green',
			tabBar: readVariable(COLOR_KEYS.TAB_BAR_COLOR) ?? 'green',
			you: readVariable(COLOR_KEYS.YOUR_COLOR) ?? 'white',
			model: readVariable(COLOR_KEYS.MODEL_COLOR) ?? 'white',
		},
	},
	openai: new OpenAI({
		apiKey: readVariable(CONFIG_KEYS.OPENAI_API_KEY) ?? '',
	}),
	keyPanic: false,
};

// Define the action types
type globalReducerAction =
	| {type: 'setModel'; model: string}
	| {type: 'setKeyPanic'; keyPanic: boolean}
	| {type: 'setKey'; key: string}
	| {type: 'setTerminalHeight'; height: string}
	| {type: 'setTerminalWidth'; width: string}
	| {type: 'setLoggingEnable'; loggingEnable: boolean}
	| {type: 'setLoggingMode'; fileMode: 'oneFile' | 'manyFiles'}
	| {type: 'setOutputDirectory'; outputDirectory: string}
	| {
			type: 'cycleColor';
			which:
				| 'OUTER_FRAME_COLOR'
				| 'INNER_FRAME_COLOR'
				| 'TAB_BAR_COLOR'
				| 'YOUR_COLOR'
				| 'MODEL_COLOR'
				| 'RESET';
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
		case 'setLoggingEnable':
			updateVariable(CONFIG_KEYS.LOGGING_ENABLE, `${action.loggingEnable}`);
			return {
				...state,
				config: {...state.config, loggingEnable: action.loggingEnable},
			};
		case 'setLoggingMode':
			updateVariable(CONFIG_KEYS.LOGGING_FILE_MODE, action.fileMode);
			return {
				...state,
				config: {...state.config, activeModel: action.fileMode},
			};
		case 'setOutputDirectory':
			updateVariable(CONFIG_KEYS.OUTPUT_DIRECTORY, action.outputDirectory);
			return {
				...state,
				config: {...state.config, activeModel: action.outputDirectory},
			};
		case 'cycleColor':
			const colors = state.config.colorMap;
			switch (action.which) {
				case 'INNER_FRAME_COLOR':
					updateVariable(action.which, cycleColor(colors.innerFrame));
					colors.innerFrame = cycleColor(colors.innerFrame);
					break;
				case 'OUTER_FRAME_COLOR':
					updateVariable(action.which, cycleColor(colors.outerFrame));
					colors.outerFrame = cycleColor(colors.outerFrame);
					break;
				case 'TAB_BAR_COLOR':
					updateVariable(action.which, cycleColor(colors.tabBar));
					colors.tabBar = cycleColor(colors.tabBar);
					break;
				case 'YOUR_COLOR':
					updateVariable(action.which, cycleColor(colors.you));
					colors.you = cycleColor(colors.you);
					break;
				case 'MODEL_COLOR':
					updateVariable(action.which, cycleColor(colors.model));
					colors.model = cycleColor(colors.model);
					break;
				case 'RESET':
					Object.keys(COLOR_KEYS).forEach(key => deleteVariable(key));
					colors.innerFrame = 'green';
					colors.outerFrame = 'green';
					colors.tabBar = 'green';
					colors.you = 'white';
					colors.model = 'white';
					break;
			}
			return {...state};
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
