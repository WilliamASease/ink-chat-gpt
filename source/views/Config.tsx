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
			}
		}
	});

	return (
		<Col>
			<Text color={'yellow'}>Your config file lives at {configFilePath}</Text>
			<Text>(U)pdate secret key (D)elete secret key (N)uke config file</Text>
			<Text>
				Colors: (1) Outer Frame (2) Inner Frame (3) TabBar (4) You (5) Model
			</Text>
			<Text>
				(H)eight {state.config.height} (W)idth {state.config.width}
			</Text>
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
