type OpenAiRequest = {
    orgId: string;
    apiKey: string;
};

export type OpenAiListModelRequest = OpenAiRequest;

export type OpenAiChatResponseRequest = OpenAiRequest & {
    model: string;
    text: string;
};

export type OpenAiImageGenerationRequest = OpenAiRequest & {
    prompt: string;
};
