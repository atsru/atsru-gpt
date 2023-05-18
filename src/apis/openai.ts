import { Configuration, OpenAIApi } from "openai";
import {
    OpenAiChatResponseRequest,
    OpenAiListModelRequest,
    OpenAiImageGenerationRequest,
} from "../models";

export const openAiApi = {
    listModels: async (request: OpenAiListModelRequest) => {
        const configuration = new Configuration({
            apiKey: request.apiKey,
            organization: request.orgId,
        });
        const openai = new OpenAIApi(configuration);
        const models = await openai.listModels();
        return models.data.data;
    },
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
    generateImages: async (request: OpenAiImageGenerationRequest) => {
        const imageUrls: string[] = [];
        const configuration = new Configuration({
            apiKey: request.apiKey,
            organization: request.orgId,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createImage({
            prompt: request.prompt,
            n: 2,
            size: "256x256",
        });
        response.data.data.map((i) => imageUrls.push(i.url ?? ""));
        return imageUrls;
    },
};
