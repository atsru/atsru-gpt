import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { openAiApi } from "../../apis";
import _ from "lodash";
import { OpenAiListModelRequest } from "../../models";
import { cache } from "../../services";
import { RootState } from "../../state/store";
import { db } from "../../services/database";

interface ChatState {
    sentMessages: string[];
    replies: { reply: string; text: string }[];
    infoMessages: string[];
    aiModels: string[];
    apiKey: string;
    orgId: string;
    model: string;
    temperature: number;
    waitingReply: boolean;
}

const initialState: ChatState = {
    sentMessages: [],
    replies: [],
    temperature: 0.3,
    orgId: "",
    apiKey: "",
    model: "",
    aiModels: [],
    infoMessages: [],
    waitingReply: false,
};

export const sendMessageToApi = createAsyncThunk(
    "chat/sendText",
    async (text: string, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { apiKey, orgId, model } = state.chatReducer;
        if (!apiKey || !orgId || !model) {
            return rejectWithValue("Missing Open AI API values");
        }
        const response = await openAiApi.generateTextResponse({
            apiKey,
            orgId,
            model,
            text,
        });
        return { reply: response, text };
    }
);

export const loadReplies = createAsyncThunk("chat/loadReplies", async () => {
    const replies = await db.replies.toArray();
    return replies.map((r) => ({ reply: r.reply, text: r.text }));
});

export const refreshAiModels = createAsyncThunk(
    "chat/refreshModels",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { apiKey, orgId } = state.chatReducer;
        if (!apiKey || !orgId) {
            return rejectWithValue("Missing Open AI API values");
        }
        const request: OpenAiListModelRequest = {
            apiKey,
            orgId,
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
            state.infoMessages.splice(action.payload, 1);
        },
    },
    extraReducers: (builder) =>
        builder
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
                state.infoMessages.push(action.payload as string);
            })
            .addCase(sendMessageToApi.fulfilled, (state, action) => {
                db.replies.add(action.payload);
                state.replies.push({
                    reply: action.payload.reply,
                    text: action.payload.text,
                });
                state.waitingReply = false;
            })
            .addCase(sendMessageToApi.pending, (state) => {
                state.waitingReply = true;
            })
            .addCase(sendMessageToApi.rejected, (state) => {
                state.waitingReply = false;
            })
            .addCase(loadReplies.fulfilled, (state, action) => {
                state.replies = action.payload;
            }),
});

export const { load, save, clear, removeDisplayMessage } = chatSlice.actions;

export default chatSlice.reducer;
