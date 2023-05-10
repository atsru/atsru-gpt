import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { openAiApi } from "../../apis";
import _ from "lodash";

interface ChatState {
    message: string;
    temperature: number;
    replies: string[];
    apiKey: string;
    aiModels: string[];
    defaultEngine: string;
}

const initialState: ChatState = {
    message: "",
    replies: [],
    temperature: 0.3,
    apiKey: "",
    aiModels: [],
    defaultEngine: "gpt",
};

export const sendMessageToApi = createAsyncThunk(
    "chat/sendText",
    async ({ message, model }: { message: string; model: string }) => {
        const response = await openAiApi.generateTextResponse(message, model);
        return response;
    }
);

export const loadAiModels = createAsyncThunk("model/list", async () => {
    const models = await openAiApi.listModels();
    return models;
});

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        write: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(sendMessageToApi.fulfilled, (state, action) => {
                state.replies.push(action.payload);
            })
            .addCase(loadAiModels.fulfilled, (state, action) => {
                const openAiModels = _.filter(action.payload, {
                    owned_by: "openai",
                });
                const openAiModelIds = _.map(openAiModels, (m) => m.id);
                state.aiModels = openAiModelIds;
            }),
});

export const { write } = chatSlice.actions;

export default chatSlice.reducer;
