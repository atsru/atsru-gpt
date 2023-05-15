import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { openAiApi } from "../../apis";
import _ from "lodash";
import { OpenAiRequest } from "../../models";
import { cache } from "../../services";
import { RootState } from "../../state/store";

interface ChatState {
    message: string;
    temperature: number;
    replies: string[];
    apiKey: string;
    orgId: string;
    aiModels: string[];
    model: string;
    displayMessages: string[];
}

const initialState: ChatState = {
    message: "",
    replies: [],
    temperature: 0.3,
    orgId: "",
    apiKey: "",
    model: "",
    aiModels: [],
    displayMessages: [],
};

export const sendMessageToApi = createAsyncThunk(
    "chat/sendText",
    async (request: OpenAiRequest) => {
        const response = await openAiApi.generateTextResponse(request);
        return response;
    }
);

export const refreshAiModels = createAsyncThunk(
    "chat/refreshModels",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { apiKey, orgId } = state.chatReducer;
        if (!apiKey || !orgId) {
            return rejectWithValue("Missing Open AI API values");
        }
        const request: OpenAiRequest = {
            apiKey,
            organization: orgId,
        };
        // use memo for this
        const models = await openAiApi.listModels(request);
        return models;
    }
);

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        write: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        save: (
            state,
            action: PayloadAction<{
                apiKey: string;
                orgId: string;
                model: string;
            }>
        ) => {
            const { model, apiKey, orgId } = action.payload;
            state.model = model;
            state.apiKey = apiKey;
            state.orgId = orgId;
            cache.setApiKey(apiKey);
            cache.setOrgId(orgId);
            cache.setModel(model);
        },
        load: (state) => {
            state.model = cache.getModel() ?? "";
            state.apiKey = cache.getApiKey() ?? "";
            state.orgId = cache.getOrgId() ?? "";
        },
        clear: (state) => {
            cache.clear();
            state.model = "";
            state.apiKey = "";
            state.orgId = "";
        },
        removeDisplayMessage: (state, action: PayloadAction<number>) => {
            state.displayMessages = state.displayMessages.filter(
                (v, i, a) => i != action.payload
            );
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(sendMessageToApi.fulfilled, (state, action) => {
                state.replies.push(action.payload);
            })
            .addCase(refreshAiModels.fulfilled, (state, action) => {
                let openAiModelIds: string[] = [];
                if (action.payload.length > 0) {
                    const openAiModels = _.filter(action.payload, {
                        owned_by: "openai",
                    });
                    openAiModelIds = _.map(openAiModels, (m) => m.id);
                }
                const apiKey = cache.getApiKey();
                const orgId = cache.getOrgId();
                state.aiModels = openAiModelIds;
                state.apiKey = apiKey ?? "";
                state.orgId = orgId ?? "";
            })
            .addCase(refreshAiModels.rejected, (state, action) => {
                state.displayMessages.push(action.payload as string);
            }),
});

export const { write, load, save, clear, removeDisplayMessage } =
    chatSlice.actions;

export default chatSlice.reducer;
