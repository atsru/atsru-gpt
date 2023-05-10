import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-YUzg57Cn6m55GxLmJ19Dokpf",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export const openAiApi = {
    generateTextResponse: async (text: string, model: string) => {
        const response = await openai.createChatCompletion({
            model,
            messages: [{ role: "user", content: text }],
        });
        return response.data.choices[0].message?.content ?? "";
    },
    listModels: async () => {
        const models = await openai.listModels();
        return models.data.data;
    },
};
