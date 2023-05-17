import { Configuration, OpenAIApi } from "openai";
import { OpenAiChatResponseRequest, OpenAiListModelRequest } from "../models";

export const openAiApi = {
    generateTextResponse: async (request: OpenAiChatResponseRequest) => {
        const configuration = new Configuration({
            apiKey: request.apiKey,
            organization: request.orgId,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createChatCompletion({
            model: request.model,
            messages: [{ role: "user", content: request.text }],
        });
        return response.data.choices[0].message?.content ?? "";
    },
    listModels: async (request: OpenAiListModelRequest) => {
        const configuration = new Configuration({
            apiKey: request.apiKey,
            organization: request.orgId,
        });
        const openai = new OpenAIApi(configuration);
        const models = await openai.listModels();
        return models.data.data;
    },
};
