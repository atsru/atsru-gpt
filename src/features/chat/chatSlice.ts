import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { openAiApi } from "../../apis";
import _ from "lodash";
import { OpenAiListModelRequest } from "../../models";
import { cache } from "../../services";
import { RootState } from "../../state/store";
import { db } from "../../services/database";

interface ReplyType {
    reply: string;
    text: string;
    type: "text" | "image";
    imageUrls?: string[];
}
interface ChatState {
    sentMessages: string[];
    replies: ReplyType[];
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

export const generateImages = createAsyncThunk(
    "chat/generateImages",
    async (text: string, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { apiKey, orgId } = state.chatReducer;
        if (!apiKey || !orgId) {
            return rejectWithValue("Missing Open AI API values");
        }
        const imageUrls = await openAiApi.generateImages({
            apiKey,
            orgId,
            prompt: text,
        });
        return { imageUrls, text };
    }
);

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
    return replies.map((r) => ({
        reply: r.reply,
        text: r.text,
        type: r.type ?? "text",
        imageUrls: r.imageUrls,
    }));
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
        clearDb: (state) => {
            db.replies.clear();
            state.replies = [];
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
                db.replies.add({
                    ...action.payload,
                    type: "text",
                });
                state.replies.push({
                    reply: action.payload.reply,
                    text: action.payload.text,
                    type: "text",
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
            })
            .addCase(generateImages.fulfilled, (state, action) => {
                db.replies.add({
                    ...action.payload,
                    reply: "N/A",
                    type: "image",
                });
                state.replies.push({
                    reply: "N/A",
                    type: "image",
                    text: action.payload.text,
                    imageUrls: action.payload.imageUrls,
                });
                state.waitingReply = false;
            })
            .addCase(generateImages.pending, (state) => {
                state.waitingReply = true;
            })
            .addCase(generateImages.rejected, (state) => {
                state.waitingReply = false;
            }),
});

export const { load, save, clear, clearDb, removeDisplayMessage } =
    chatSlice.actions;

export default chatSlice.reducer;
