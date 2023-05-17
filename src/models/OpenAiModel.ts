export type OpenAiListModelRequest = {
    orgId: string;
    apiKey: string;
};

export type OpenAiChatResponseRequest = {
    orgId: string;
    apiKey: string;
    model: string;
    text: string;
};
