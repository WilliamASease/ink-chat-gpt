import React, {Dispatch, useState} from 'react';
import {Text, useInput} from 'ink';
import {Col, LineInput, Row} from 'waseas-ink-components/dist/exports.js';
import {globalReducerAction, globalReducerState} from '../globalReducer.js';
import {
	deleteConfigFile,
	deleteVariable,
	configFilePath,
	updateVariable,
} from '../confighelper.js';

type IProps = {
	global: [globalReducerState, Dispatch<globalReducerAction>];
};
export const Config = (props: IProps) => {
	const {global} = props;
	const [state, dispatch] = global;
	const [primeLineInput, setPrimeLineInput] = useState<{
		message: string;
		onSubmit: (fire: string) => void;
	} | null>(null);

	useInput(input => {
		if (primeLineInput === null) {
			if (input === 'u') {
				setPrimeLineInput({
					message: `This secret key will live in ${configFilePath} -- guard it with your life`,
					onSubmit: fire => {
						deleteVariable('OPENAI_API_KEY');
						updateVariable('OPENAI_API_KEY', fire);
						setPrimeLineInput(null);
					},
				});
			} else if (input === 'd') {
				setPrimeLineInput({
					message: "To delete your secret key for good, type 'doit!'",
					onSubmit: fire => {
						if (fire === 'doit!') {
							deleteVariable('OPENAI_API_KEY');
							dispatch({type: 'setKeyPanic', keyPanic: true});
						} else {
							setPrimeLineInput(null);
						}
					},
				});
			} else if (input === 'n') {
				setPrimeLineInput({
					message: "To delete the entire config file, write 'doit!'",
					onSubmit: fire => {
						if (fire === 'doit!') {
							deleteConfigFile();
							dispatch({type: 'setKeyPanic', keyPanic: true});
						} else {
							setPrimeLineInput(null);
						}
					},
				});
			} else if (input === 'h') {
				setPrimeLineInput({
					message: 'New height:',
					onSubmit: fire => {
						dispatch({type: 'setTerminalHeight', height: fire});
						setPrimeLineInput(null);
					},
				});
			} else if (input === 'w') {
				setPrimeLineInput({
					message: 'New width:',
					onSubmit: fire => {
						dispatch({type: 'setTerminalWidth', width: fire});
						setPrimeLineInput(null);
					},
				});
			} else if (input === 'l') {
				dispatch({
					type: 'setLoggingEnable',
					loggingEnable: !state.config.loggingEnable,
				});
			} else if (input === 'k') {
				dispatch({
					type: 'setLoggingMode',
					fileMode:
						state.config.loggingMode === 'oneFile' ? 'manyFiles' : 'oneFile',
				});
			} else if (input === 'o') {
				setPrimeLineInput({
					message: 'New output directory:',
					onSubmit: fire => {
						dispatch({type: 'setOutputDirectory', outputDirectory: fire});
						setPrimeLineInput(null);
					},
				});
			} else if (['1', '2', '3', '4', '5', '0'].includes(input)) {
				const array: [
					'OUTER_FRAME_COLOR',
					'INNER_FRAME_COLOR',
					'TAB_BAR_COLOR',
					'YOUR_COLOR',
					'MODEL_COLOR',
				] = [
					'OUTER_FRAME_COLOR',
					'INNER_FRAME_COLOR',
					'TAB_BAR_COLOR',
					'YOUR_COLOR',
					'MODEL_COLOR',
				];
				dispatch({
					type: 'cycleColor',
					which: array[parseInt(input) - 1] ?? 'RESET',
				});
			}
		}
	});

	return (
		<Col flexGrow={1}>
			<Text color={'yellow'}>Your config file lives at {configFilePath}</Text>
			<Text>(U)pdate secret key (D)elete secret key (N)uke config file</Text>
			<Text>Colors: </Text>
			<Row>
				<Text> (1) </Text>
				<Text color={state.config.colorMap.outerFrame}>Outer Frame</Text>
				<Text> (2) </Text>
				<Text color={state.config.colorMap.innerFrame}>Inner Frames</Text>
				<Text> (3) </Text>
				<Text color={state.config.colorMap.tabBar}>TabBar</Text>
				<Text> (4) </Text>
				<Text color={state.config.colorMap.you}>You</Text>
				<Text> (5) </Text>
				<Text color={state.config.colorMap.model}>Model</Text>
				<Text> (0) Reset</Text>
			</Row>
			<Text>
				(H)eight {state.config.height} (W)idth {state.config.width}
			</Text>
			<Text>
				(L)ogging is {state.config.loggingEnable ? 'ON' : 'OFF'}. (K)eep logs in{' '}
				{state.config.loggingMode === 'oneFile'
					? 'One File'
					: 'Group by session'}
			</Text>
			<Text>(O)utput directory = {state.config.outputDirectory}</Text>
			<Col flexGrow={1} />
			<Row flexGrow={1} />
			{primeLineInput !== null ? (
				<Col>
					<Text>{primeLineInput.message}</Text>
					<LineInput linePrefix=">" onSubmit={primeLineInput.onSubmit} />
				</Col>
			) : null}
		</Col>
	);
};
