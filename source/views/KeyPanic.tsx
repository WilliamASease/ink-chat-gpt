import {Dispatch} from 'react';
import {globalReducerAction, globalReducerState} from '../globalReducer.js';
import {configFilePath} from '../confighelper.js';
import {Col, LineInput, Row} from 'waseas-ink-components/dist/exports.js';
import React from 'react';
import {Text} from 'ink';

type IProps = {
	global: [globalReducerState, Dispatch<globalReducerAction>];
};
export const KeyPanic = (props: IProps) => {
	const {global} = props;
	const [, dispatch] = global;

	return (
		<Col>
			<Row borderColor={'red'} borderStyle={'single'}>
				<Text color={'red'}>No Key Error</Text>
			</Row>
			<Text>
				If you're here, you have no config file, or no OPENAI_API_KEY In that
				file.
			</Text>
			<Text>The file lives at {configFilePath}</Text>
			<Text>Get one from the OpenAI platform</Text>
			<Text>And give it to us here:</Text>
			<LineInput
				linePrefix=">"
				onSubmit={fire => {
					dispatch({type: 'setKey', key: fire});
					dispatch({type: 'setKeyPanic', keyPanic: false});
				}}
			/>
			<Text> </Text>
			<Text color={'yellow'}>
				And if you haven't heard already, be really careful with this key -- it
				can be used
			</Text>
			<Text color={'yellow'}>To bill requests to you!</Text>
		</Col>
	);
};
