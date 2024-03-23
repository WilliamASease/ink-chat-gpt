import {Box} from 'ink';
import React, {useEffect, useReducer} from 'react';
import dotenv from 'dotenv';
import {Switcher} from 'waseas-ink-components/dist/exports.js';
import {Chat} from './views/Chat.js';
import {Models} from './views/Models.js';
import {Config} from './views/Config.js';
import {globalReducer, globalReducerinitialState} from './globalReducer.js';
import pkg from 'lodash';
import {KeyPanic} from './views/KeyPanic.js';
const {isNil} = pkg;

dotenv.config();

export default function App() {
	const global = useReducer(globalReducer, globalReducerinitialState);
	const [state, dispatch] = global;

	useEffect(() => {
		const key = process.env['OPENAI_API_KEY'];
		if (isNil(key)) {
			dispatch({type: 'setKeyPanic', keyPanic: true});
		} else {
			dispatch({type: 'newOpenAI', key: key});
		}
	}, []);

	return (
		<Box
			flexDirection="column"
			borderColor={'green'}
			borderStyle={'classic'}
			padding={1}
			height={20}
			width={100}
		>
			{state.keyPanic ? (
				<KeyPanic global={global} />
			) : (
				<Switcher
					sections={[
						{
							display: 'Chat',
							component: <Chat global={global} />,
						},
						{
							display: 'Models',
							component: <Models global={global} />,
						},
						{
							display: 'Config',
							component: <Config global={global} />,
						},
					]}
				/>
			)}
		</Box>
	);
}
