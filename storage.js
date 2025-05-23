const store = new Map();

export async function storeDiscordTokens(userId, tokens) {
    await store.set(`discord-${userId}`, tokens);
}

export async function getDiscordTokens(userId) {
    return store.get(`discord-${userId}`);
}

export async function deleteDiscordTokens(userId) {
    const key = `discord-${userId}`;
    await store.delete(key);
}
