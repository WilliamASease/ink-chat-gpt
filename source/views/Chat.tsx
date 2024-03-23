import React, {Dispatch, useCallback, useState} from 'react';
import {Col, LineInput} from 'waseas-ink-components/dist/exports.js';
import {Text, Box} from 'ink';
import {singleChatRequest} from '../api.js';
import {globalReducerAction, globalReducerState} from '../globalReducer.js';

type IProps = {
	global: [globalReducerState, Dispatch<globalReducerAction>];
};
export const Chat = (props: IProps) => {
	const {global} = props;
	const [state] = global;

	const [response, setResponse] = useState('');
	const [thinking, setThinking] = useState(false);
	const [replyTime, setReplyTime] = useState<number>();

	return (
		<Col>
			<Col></Col>
			<Col paddingTop={1}>
				<Text>You</Text>
				<Box
					flexDirection="column"
					borderColor={'green'}
					borderStyle={'classic'}
					height={5}
					marginBottom={1}
					width={90}
				>
					<LineInput
						linePrefix=">"
						onSubmit={useCallback(
							(fire: string) => {
								let go = Date.now();
								setThinking(true);
								setReplyTime(undefined);
								singleChatRequest(fire, state.openai)
									.then(setResponse)
									.finally(() => {
										setThinking(false);
										setReplyTime(Date.now() - go);
									});
							},
							[state.openai, setResponse],
						)}
					/>
				</Box>
				<Text>{`ChatGPT ${state.activeModel} ${
					thinking ? '(thinking...)' : replyTime ? `(${replyTime}ms)` : ''
				}`}</Text>
				<Box
					flexDirection="column"
					borderColor={'green'}
					borderStyle={'classic'}
					padding={1}
					height={12}
					width={90}
				>
					<Text>{response}</Text>
				</Box>
			</Col>
		</Col>
	);
};
