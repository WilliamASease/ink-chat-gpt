import {Box} from 'ink';
import React, {useEffect, useReducer} from 'react';
import {Switcher} from 'waseas-ink-components/dist/exports.js';
import {Chat} from './views/Chat.js';
import {Models} from './views/Models.js';
import {Config} from './views/Config.js';
import {globalReducer, globalReducerinitialState} from './globalReducer.js';
import pkg from 'lodash';
import {KeyPanic} from './views/KeyPanic.js';
const {isNil} = pkg;

export default function App() {
	const global = useReducer(globalReducer, globalReducerinitialState);
	const [state, dispatch] = global;

	useEffect(() => {
		if (isNil(state.config.apiKey)) {
			dispatch({type: 'setKeyPanic', keyPanic: true});
		}
	}, [state.config.apiKey]);

	return (
		<Box
			flexDirection="column"
			borderColor={state.config.colorMap.outerFrame}
			borderStyle={'classic'}
			padding={1}
			height={parseInt(state.config.height)}
			width={parseInt(state.config.width)}
		>
			{state.keyPanic ? (
				<KeyPanic global={global} />
			) : (
				<Switcher
					textColor={state.config.colorMap.tabBar}
					containerProps={{flexDirection: 'column', flexGrow: 1}}
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
