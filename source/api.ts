import OpenAI from "openai";

export const singleChatRequest = async (message:string, openai:OpenAI) => {
	const response: OpenAI.Chat.Completions.ChatCompletion =
		await openai.chat.completions
			.create({
				model: 'gpt-3.5-turbo',
				messages: [{role: 'user', content: message}],
				temperature: 0,
				max_tokens: 1000,
			})
			.catch(err => err);
	return response.choices[0]?.message.content ?? '';
};