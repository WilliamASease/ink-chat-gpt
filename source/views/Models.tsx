import React, {Dispatch, useCallback, useEffect, useState} from 'react';
import {Text} from 'ink';
import {
	Col,
	Row,
	ScrollingSelectionList,
} from 'waseas-ink-components/dist/exports.js';
import {Model} from 'openai/resources/models.mjs';
import {globalReducerAction, globalReducerState} from '../globalReducer.js';
import pkg from 'lodash';
const {isEmpty, isNil} = pkg;

type IProps = {
	global: [globalReducerState, Dispatch<globalReducerAction>];
};
export const Models = (props: IProps) => {
	const {global} = props;
	const [state, dispatch] = global;
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
			setModels(out.sort((a, b) => a.id.localeCompare(b.id)));
		});
	}, [state.openai]);

	useEffect(() => {
		if (!isEmpty(state.config.activeModel)) {
			state.openai.models
				.retrieve(state.config.activeModel)
				.then(setLoadedActiveModel);
		}
	}, [state.config.activeModel, state.openai]);

	return (
		<Row>
			<Col
				borderColor={state.config.colorMap.innerFrame}
				paddingRight={1}
				borderStyle={'classic'}
			>
				<ScrollingSelectionList<Model>
					items={models}
					getText={model => model?.id ?? ''}
					findInitialIndex={useCallback(
						(model: Model) => model?.id === state.config.activeModel,
						[],
					)}
					visibleRows={10}
					onHover={useCallback(
						(selection?: Model) => {
							if (!isNil(selection) && !isEmpty(selection?.id)) {
								dispatch({type: 'setModel', model: selection?.id});
							}
						},
						[dispatch],
					)}
				/>
			</Col>
			<Col
				marginLeft={2}
				borderStyle={'single'}
				borderColor={state.config.colorMap.innerFrame}
				flexGrow={1}
			>
				{loadedActiveModel && (
					<Col>
						<Text>id: {loadedActiveModel.id}</Text>
						<Text>
							created: {new Date(loadedActiveModel.created * 1000).toJSON()}
						</Text>
						<Text>object type: {loadedActiveModel.object}</Text>
						<Text>owned by: {loadedActiveModel.owned_by}</Text>
					</Col>
				)}
			</Col>
		</Row>
	);
};
