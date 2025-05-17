import crypto from "crypto";
import fetch from "node-fetch";
import { config } from "dotenv";
config();

import * as storage from "./storage.js";

export function getOAuthUrl() {
    const state = crypto.randomUUID();
    const url = new URL("https://discord.com/api/oauth2/authorize");
    url.searchParams.set("client_id", process.env.CLIENT_ID);
    url.searchParams.set("redirect_uri", process.env.REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", state);
    url.searchParams.set("scope", "role_connections.write identify");
    url.searchParams.set("prompt", "consent");
    return { state, url: url.toString() };
}

export async function getOAuthTokens(code) {
    const url = "https://discord.com/api/v10/oauth2/token";
    const body = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI,
    });

    const response = await fetch(url, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorText = await response.text();
        throw new Error(
            `❌ Error fetching OAuth tokens: [${response.status}] ${errorText}`
        );
    }
}

export async function getAccessToken(userId, tokens) {
    if (Date.now() > tokens.expires_at) {
        console.log(`🔄 Refreshing access token for ${userId}...`);
        const url = "https://discord.com/api/v10/oauth2/token";
        const body = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: tokens.refresh_token,
        });

        const response = await fetch(url, {
            method: "POST",
            body,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        if (response.ok) {
            const newTokens = await response.json();
            newTokens.expires_at = Date.now() + newTokens.expires_in * 1000;
            await storage.storeDiscordTokens(userId, newTokens);
            return newTokens.access_token;
        } else {
            const errorText = await response.text();
            throw new Error(
                `❌ Error refreshing access token: [${response.status}] ${errorText}`
            );
        }
    }
    return tokens.access_token;
}

export async function getUserData(tokens, botToken = null) {
    let url, headers;

    if (botToken) {
        url = `https://discord.com/api/v10/users/${tokens}`; // tokens burada userId olarak kullanılıyor
        headers = { Authorization: `Bot ${botToken}` };
    } else {
        url = "https://discord.com/api/v10/oauth2/@me";
        headers = { Authorization: `Bearer ${tokens.access_token}` };
    }

    const response = await fetch(url, { headers });
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        throw new Error(
            `❌ Invalid response type: ${contentType}. Error: ${errorText}`
        );
    }

    if (response.ok) {
        try {
            const data = await response.json();
            return botToken ? data : data.user;
        } catch (error) {
            throw new Error(`❌ JSON parse error: ${error.message}`);
        }
    } else {
        const errorText = await response.text();
        throw new Error(
            `❌ Error fetching user data: [${response.status}] ${errorText}`
        );
    }
}

export async function pushMetadata(userId, tokens, metadata) {
    const userData = await getUserData(tokens);
    const username = userData.user.username;
    const url = `https://discord.com/api/v10/users/@me/applications/${process.env.CLIENT_ID}/role-connection`;
    const accessToken = await getAccessToken(userId, tokens);

    const body = {
        platform_name: "BlitzForge Studios",
        platform_username: "@" + username,
        metadata,
    };

    console.log(
        `📡 Sending metadata for ${userId}:`,
        JSON.stringify(body, null, 2)
    );

    const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `❌ Error pushing metadata: [${response.status}] ${errorText}`
        );
    }
    console.log(`✅ Successfully updated metadata for ${userId}`);
}

export async function getMetadata(userId, tokens) {
    const url = `https://discord.com/api/v10/users/@me/applications/${process.env.CLIENT_ID}/role-connection`;
    const accessToken = await getAccessToken(userId, tokens);

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorText = await response.text();
        throw new Error(
            `❌ Error getting metadata: [${response.status}] ${errorText}`
        );
    }
}
