import React, {Dispatch, useEffect, useState} from 'react';
import {Text} from 'ink';
import {Col, Row} from 'waseas-ink-components/dist/exports.js';
import {Model} from 'openai/resources/models.mjs';
import {globalReducerAction, globalReducerState} from '../globalReducer.js';

type IProps = {
	global: [globalReducerState, Dispatch<globalReducerAction>];
};
export const Models = (props: IProps) => {
	const {global} = props;
	const [state, _dispatch] = global;
	const [models, setModels] = useState<Model[]>();
	const [loadedActiveModel, setLoadedActiveModel] = useState<Model>();

	useEffect(() => {
		state.openai.models.list().then(async response => {
			let page = response;
			let out: Model[] = [];
			out.push(...page.getPaginatedItems());
			while (page.hasNextPage()) {
				page = await response.getNextPage();
				out.push(...page.getPaginatedItems());
			}
			setModels(out);
		});
	}, [state.openai]);

	useEffect(() => {
		state.openai.models.retrieve(state.activeModel).then(setLoadedActiveModel);
	}, [state.activeModel, state.openai]);

	return (
		<Row>
			<Col>
				{models?.map((model, idx) => (
					<Text key={idx}>
						{model.id === state.activeModel ? '--> ' : '    '}
						{model.id}
					</Text>
				))}
			</Col>
			<Col
				marginLeft={2}
				borderStyle={'single'}
				borderColor={'greenBright'}
				flexGrow={1}
			>
				{loadedActiveModel && (
					<Col>
						<Text>id: {loadedActiveModel.id}</Text>
						<Text>created: {new Date(loadedActiveModel.created).toJSON()}</Text>
						<Text>object type: {loadedActiveModel.object}</Text>
						<Text>owned by: {loadedActiveModel.owned_by}</Text>
					</Col>
				)}
			</Col>
		</Row>
	);
};
