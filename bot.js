import { Client, GatewayIntentBits } from "discord.js";
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

    // Sadece yetkili kullanıcılar kullanabilir
    if (!interaction.member.permissions.has("Administrator")) {
        return interaction.reply({
            content: "❌ Bu komutu kullanma yetkiniz yok!",
            ephemeral: true,
        });
    }

    try {
        if (commandName === "addrole") {
            const user = options.getUser("user");
            const role = options.getString("role");

            await interaction.deferReply({ ephemeral: true });

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
                    ephemeral: true,
                });
            } else {
                await interaction.editReply({
                    content: `❌ Hata: ${
                        data.error || "Bilinmeyen bir hata oluştu"
                    }`,
                    ephemeral: true,
                });
            }
        } else if (commandName === "removerole") {
            const user = options.getUser("user");

            await interaction.deferReply({ ephemeral: true });

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
                    ephemeral: true,
                });
            } else {
                await interaction.editReply({
                    content: "❌ Rolleri kaldırırken bir hata oluştu!",
                    ephemeral: true,
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
