import { Configuration, OpenAIApi } from "openai";
import { OpenAiRequest } from "../models";

const getOpenAiService = ({ apiKey, organization }: OpenAiRequest) => {
    const configuration = new Configuration({
        apiKey,
        organization,
    });
    const openai = new OpenAIApi(configuration);
    return openai;
};

export const openAiApi = {
    generateTextResponse: async (request: OpenAiRequest) => {
        const response = await getOpenAiService(request).createChatCompletion({
            model: request.model,
            messages: [{ role: "user", content: request.text }],
        });
        return response.data.choices[0].message?.content ?? "";
    },
    listModels: async (request: OpenAiRequest) => {
        const models = await getOpenAiService(request).listModels();
        return models.data.data;
    },
};
