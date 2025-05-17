import { Client, GatewayIntentBits, MessageFlags } from "discord.js";
import { config } from "dotenv";
import fetch from "node-fetch";

config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
    console.log(`🤖 ${client.user.tag} is ready!`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    try {
        if (commandName === "ping") {
            await interaction.reply({ content: "Pong!" });
        } else if (commandName === "addrole") {
            const user = options.getUser("user");
            const role = options.getString("role");

            try {
                const response = await fetch(
                    "https://blitzforge-redirect.onrender.com/discord/commands/add-role",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bot " + process.env.CLIENT_TOKEN,
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            role: role,
                        }),
                    }
                );

                let data;
                try {
                    const text = await response.text();
                    console.log("Raw server response:", text);
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("JSON parse error:", e);
                    throw new Error(
                        "Sunucudan geçersiz yanıt alındı: " + e.message
                    );
                }

                if (response.ok && data.success) {
                    await interaction.reply({
                        content: `✅ ${user.tag} kullanıcısına ${role} rolü verildi!`,
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    throw new Error(data.error || "Bilinmeyen bir hata oluştu");
                }
            } catch (error) {
                console.error("Error in addrole command:", error);
                await interaction.reply({
                    content: `❌ Hata: ${error.message}`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        } else if (commandName === "removerole") {
            const user = options.getUser("user");

            try {
                const response = await fetch(
                    "https://blitzforge-redirect.onrender.com/remove-metadata",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bot " + process.env.CLIENT_TOKEN,
                        },
                        body: JSON.stringify({
                            userId: user.id,
                        }),
                    }
                );

                let responseText;
                try {
                    responseText = await response.text();
                    if (!response.ok) {
                        throw new Error(`Sunucu hatası: ${responseText}`);
                    }
                } catch (e) {
                    throw new Error(`API hatası: ${e.message}`);
                }

                await interaction.reply({
                    content: `✅ ${user.tag} kullanıcısının tüm rolleri kaldırıldı!`,
                    flags: MessageFlags.Ephemeral,
                });
            } catch (error) {
                console.error("Error in removerole command:", error);
                await interaction.reply({
                    content: `❌ Hata: ${error.message}`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        try {
            await interaction.reply({
                content:
                    "❌ Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
                flags: MessageFlags.Ephemeral,
            });
        } catch (replyError) {
            console.error("Error sending error message:", replyError);
        }
    }
});

client.login(process.env.CLIENT_TOKEN).catch(console.error);
