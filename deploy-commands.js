import { REST, Routes } from "discord.js";
import { config } from "dotenv";

config();

const TOKEN = process.env.CLIENT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
    {
        name: "ping",
        description: "pong?",
        defaultMemberPermissions: "Administrator",
    },
    {
        name: "addrole",
        description: "Add role to user",
        defaultMemberPermissions: "Administrator",
        options: [
            {
                name: "user",
                description: "The user",
                type: 6,
                required: true,
            },
            {
                name: "role",
                description: "The role",
                type: 3,
                required: true,
                choices: [
                    { name: "🛠️ Developer", value: "dev" },
                    { name: "🛡️ Moderator", value: "mod" },
                    { name: "📢 Advertiser", value: "ads" },
                    { name: "👑 Owner", value: "owner" },
                ],
            },
        ],
    },
    {
        name: "removerole",
        description: "Remove role from the staff",
        defaultMemberPermissions: "Administrator",
        options: [
            {
                name: "user",
                description: "The user",
                type: 6,
                required: true,
            },
        ],
    },
];

const rest = new REST().setToken(process.env.CLIENT_TOKEN);

async function main() {
    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
        const currentCommands = await rest.get(
            Routes.applicationCommands(CLIENT_ID)
        );

        const launchCommand = currentCommands.find(
            (cmd) => cmd.name === "launch"
        );

        if (launchCommand) {
            const updatedCommands = [launchCommand, ...commands];

            await rest.put(Routes.applicationCommands(CLIENT_ID), {
                body: updatedCommands,
            });

            console.log("✅ Komutlar başarıyla güncellendi!");
        } else {
            console.log("⚠️ Entry Point komutu bulunamadı");
        }
    } catch (error) {
        console.error("❌ Hata:", error);
    }
}

main();
