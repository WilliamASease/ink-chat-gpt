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

	const [response, setResponse] = useState<{reply?: string; error?: string}>({
		reply: '',
	});
	const [thinking, setThinking] = useState(false);
	const [replyTime, setReplyTime] = useState<number>();
	const gptHeader = useMemo(
		() =>
			`${state.config.activeModel} ${
				thinking ? '(thinking...)' : replyTime ? `(${replyTime}ms)` : ''
			} ${response.error ?? ''}`,
		[state.config.activeModel, thinking, replyTime],
	);

	return (
		<Col flexGrow={1} paddingTop={1}>
			<Col paddingBottom={1}>
				<Text color={state.config.colorMap.you}>You</Text>
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
			</Col>
			<Text color={state.config.colorMap.model}>{gptHeader}</Text>
			<Text color={state.config.colorMap.model}>
				{new Array(gptHeader.length).fill('-')}
			</Text>
			<Text color={state.config.colorMap.model}>{response.reply}</Text>
		</Col>
	);
};
