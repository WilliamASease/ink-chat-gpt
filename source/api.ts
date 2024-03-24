import OpenAI from 'openai';

export const singleChatRequest = async (
	message: string,
	openai: OpenAI,
	model: string,
) => {
	const response: string = await openai.chat.completions
		.create({
			model: model,
			messages: [{role: 'user', content: message}],
			temperature: 0,
			max_tokens: 1000,
		})
		.then(fulfilled => fulfilled.choices[0]?.message.content ?? '')
		.catch(err => {
			console.log(err);
			return err.message;
		});
	return response;
};
