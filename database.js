import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

export async function connectDB() {
    try {
        await client.connect();
        db = client.db("blitzforge");
        console.log("📦 MongoDB bağlantısı başarılı");
    } catch (error) {
        console.error("❌ MongoDB bağlantı hatası:", error);
        process.exit(1);
    }
}

export async function getUser(userId) {
    try {
        return await db.collection("users").findOne({ userId });
    } catch (error) {
        console.error("Kullanıcı getirme hatası:", error);
        return null;
    }
}

export async function updateUser(userId, data) {
    try {
        const result = await db.collection("users").updateOne(
            { userId },
            {
                $set: {
                    ...data,
                    updatedAt: new Date(),
                },
            },
            { upsert: true }
        );
        return result;
    } catch (error) {
        console.error("Kullanıcı güncelleme hatası:", error);
        return null;
    }
}

export async function getAllowedUsers() {
    try {
        return await db
            .collection("users")
            .find({
                $or: [
                    { is_dev: true },
                    { is_mod: true },
                    { is_ads: true },
                    { is_owner: true },
                ],
            })
            .toArray();
    } catch (error) {
        console.error("Kullanıcıları getirme hatası:", error);
        return [];
    }
}
