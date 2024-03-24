import React, {Dispatch, useCallback, useMemo, useState} from 'react';
import {Col, LineInput} from 'waseas-ink-components/dist/exports.js';
import {Text} from 'ink';
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
	const gptHeader = useMemo(
		() =>
			`${state.config.activeModel} ${
				thinking ? '(thinking...)' : replyTime ? `(${replyTime}ms)` : ''
			}`,
		[state.config.activeModel, thinking, replyTime],
	);

	return (
		<Col flexGrow={1} paddingTop={1}>
			<Text>You</Text>

			<LineInput
				linePrefix=">"
				onSubmit={useCallback(
					(fire: string) => {
						let go = Date.now();
						setThinking(true);
						setReplyTime(undefined);
						singleChatRequest(fire, state.openai, state.config.activeModel)
							.then(setResponse)
							.finally(() => {
								setThinking(false);
								setReplyTime(Date.now() - go);
							});
					},
					[state.openai, setResponse, state.config.activeModel],
				)}
			/>
			<Text>{gptHeader}</Text>
			<Text>{new Array(gptHeader.length).fill('-')}</Text>
			<Text>{response}</Text>
		</Col>
	);
};
