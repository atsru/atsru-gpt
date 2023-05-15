const apiKeyCacheKey = "apikey";
const orgIdCacheKey = "orgidkey";
const modelCacheKey = "modelkey";

const saveToStorage = (key: string, value: string) =>
    localStorage.setItem(key, value);
const clearAllFromStorage = () => localStorage.clear();
const getFromStorage = (key: string) => localStorage.getItem(key);

export const cache = {
    getApiKey: () => getFromStorage(apiKeyCacheKey),
    getOrgId: () => getFromStorage(orgIdCacheKey),
    getModel: () => getFromStorage(modelCacheKey),
    setApiKey: (apiKeyValue: string) =>
        saveToStorage(apiKeyCacheKey, apiKeyValue),
    setOrgId: (orgIdValue: string) => saveToStorage(orgIdCacheKey, orgIdValue),
    setModel: (model: string) => saveToStorage(modelCacheKey, model),
    clear: () => clearAllFromStorage(),
};
