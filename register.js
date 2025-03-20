import fetch from "node-fetch";
import { config } from "dotenv";
config();

const url = `https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/role-connections/metadata`;

const body = [
  {
    key: "is_dev",
    name: "engineer",
    description: "A role for developers. Claimable by game devs, website devs, and security managers.",
    type: 7, // boolean_eq
  },
  {
    key: "is_mod",
    name: "enforcer",
    description: "A role for moderators. Claimable by users who moderate content.",
    type: 7, // boolean_eq
  },
  {
    key: "is_ads",
    name: "promoter",
    description: "A role for advertisers. Claimable by users who manage ads or promotions.",
    type: 7, // boolean_eq
  },
  {
    key: "is_admin",
    name: "producer",
    description: "A role for administrators. Claimable by users who have admin privileges.",
    type: 7, // boolean_eq
  },
  {
    key: "is_owner",
    name: "founder",
    description: "A role for owners. Claimable by users who are the owner of the project.",
    type: 7, // boolean_eq
  },
];

const response = await fetch(url, {
  method: "PUT",
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
  },
});

if (response.ok) {
  const data = await response.json();
  console.log("✅ Metadata registered successfully:", data);
} else {
  const data = await response.text();
  console.error("❌ Error registering metadata:", data);
}
