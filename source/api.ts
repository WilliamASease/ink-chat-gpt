import OpenAI from 'openai';

export const singleChatRequest = async (
	message: string,
	openai: OpenAI,
	model: string,
) => {
	const response: {reply?: string; error?: string} =
		await openai.chat.completions
			.create({
				model: model,
				messages: [{role: 'user', content: message}],
				temperature: 0,
				max_tokens: 1000,
			})
			.then(fulfilled => ({reply: fulfilled.choices[0]?.message.content ?? ''}))
			.catch(err => {
				console.log(err);
				return {error: err.message};
			});
	return response;
};
