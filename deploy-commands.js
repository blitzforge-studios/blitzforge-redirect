import { REST, Routes } from "discord.js";
import { config } from "dotenv";

config();

const TOKEN = process.env.CLIENT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
    {
        name: "addrole",
        description: "Kullanıcıya rol ekle",
        options: [
            {
                name: "user",
                description: "Role eklenecek kullanıcı",
                type: 6,
                required: true,
            },
            {
                name: "role",
                description: "Eklenecek rol",
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
        description: "Kullanıcıdan rol sil",
        options: [
            {
                name: "user",
                description: "Rolü silinecek kullanıcı",
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
