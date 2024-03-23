import {Dispatch, useEffect} from 'react';
import {globalReducerAction, globalReducerState} from '../globalReducer.js';
import {ensureEnvFileExists, updateEnvVariable} from '../envhelpermethods.js';
import {Col, LineInput, Row} from 'waseas-ink-components/dist/exports.js';
import React from 'react';
import {Text} from 'ink';

type IProps = {
	global: [globalReducerState, Dispatch<globalReducerAction>];
};
export const KeyPanic = (props: IProps) => {
	const {global} = props;
	const [, dispatch] = global;
	useEffect(ensureEnvFileExists);

	return (
		<Col>
			<Row borderColor={'red'} borderStyle={'single'}>
				<Text color={'red'}>No Key Error</Text>
			</Row>
			<Text>If you're here, you had no .env file, or no OPEN_API_KEY</Text>
			<Text>In that file.</Text>
			<Text>Get one from the OpenAI platform</Text>
			<Text>And give it to us here:</Text>
			<LineInput
				linePrefix=">"
				onSubmit={fire => {
					updateEnvVariable('OPENAI_API_KEY', fire);
					dispatch({type: 'newOpenAI', key: fire});
					dispatch({type: 'setKeyPanic', keyPanic: false});
				}}
			/>
			<Text> </Text>
			<Text color={'yellow'}>
				And if you haven't heard already, be really careful with this key -- it
				can be used
			</Text>
			<Text color={'yellow'}>To fire requests on your credit card!</Text>
		</Col>
	);
};
