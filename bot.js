import {
    Client,
    GatewayIntentBits,
    MessageFlags,
    PermissionsBitField,
} from "discord.js";
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
        if (commandName === "addrole") {
            const user = options.getUser("user");
            const role = options.getString("role");

            await interaction.deferReply({ ephemeral: MessageFlags.Ephemeral });

            const response = await fetch(
                "https://blitzforge-redirect.onrender.com/discord/commands/add-role",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        role: role,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                await interaction.editReply({
                    content: `✅ ${user.tag} kullanıcısına ${role} rolü verildi!`,
                });
            } else {
                await interaction.editReply({
                    content: `❌ Hata: ${
                        data.error || "Bilinmeyen bir hata oluştu"
                    }`,
                });
            }
        } else if (commandName === "removerole") {
            const user = options.getUser("user");

            await interaction.deferReply({ ephemeral: MessageFlags.Ephemeral });

            const response = await fetch(
                "https://blitzforge-redirect.onrender.com/remove-metadata",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user.id,
                    }),
                }
            );

            if (response.ok) {
                await interaction.editReply({
                    content: `✅ ${user.tag} kullanıcısının rolleri kaldırıldı!`,
                });
            } else {
                await interaction.editReply({
                    content: "❌ Rolleri kaldırırken bir hata oluştu!",
                });
            }
        }
    } catch (error) {
        console.error("Komut çalıştırılırken hata:", error);
        await interaction
            .editReply({
                content: "❌ Bir hata oluştu!",
                ephemeral: true,
            })
            .catch(() => {});
    }
});

client.login(process.env.CLIENT_TOKEN);
