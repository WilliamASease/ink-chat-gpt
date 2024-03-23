import React, {Dispatch, useEffect, useState} from 'react';
import {Text, useInput} from 'ink';
import {Col, LineInput} from 'waseas-ink-components/dist/exports.js';
import {globalReducerAction, globalReducerState} from '../globalReducer.js';
import {
	deleteEnvVariable,
	ensureEnvFileExists,
	updateEnvVariable,
} from '../envhelpermethods.js';

type IProps = {
	global: [globalReducerState, Dispatch<globalReducerAction>];
};
export const Config = (props: IProps) => {
	const {global} = props;
	const [_state, dispatch] = global;
	const [primeLineInput, setPrimeLineInput] = useState<{
		message: string;
		onSubmit: (fire: string) => void;
	} | null>(null);

	useEffect(ensureEnvFileExists);
	useInput(input => {
		if (primeLineInput === null) {
			if (input === 'u') {
				setPrimeLineInput({
					message:
						'This secret key will live in .env -- guard it with your life',
					onSubmit: fire => {
						deleteEnvVariable('OPENAI_API_KEY');
						updateEnvVariable('OPENAI_API_KEY', fire);
					},
				});
			} else if (input === 'd') {
				setPrimeLineInput({
					message: "To delete your secret key for good, type 'doit!'",
					onSubmit: fire => {
						if (fire === 'doit!') {
							deleteEnvVariable('OPENAI_API_KEY');
							dispatch({type: 'setKeyPanic', keyPanic: true});
						} else {
							setPrimeLineInput(null);
						}
					},
				});
			}
		}
	});

	return (
		<Col>
			<Text>(U)pdate secret key</Text>
			<Text>(D)elete secret key</Text>
			<Text>(C)olors</Text>
			{primeLineInput !== null ? (
				<Col>
					<Text>{primeLineInput.message}</Text>
					<LineInput linePrefix=">" onSubmit={primeLineInput.onSubmit} />
				</Col>
			) : null}
		</Col>
	);
};
