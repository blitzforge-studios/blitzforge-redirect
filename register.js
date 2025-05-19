import fetch from "node-fetch";
import { config } from "dotenv";
config();

const url = `https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/role-connections/metadata`;

const body = [
    {
        key: "is_dev",
        name: "engineer",
        name_localizations: {
            tr: "mühendis",
            fr: "ingénieur",
            de: "ingenieur",
            "pt-BR": "engenheiro",
            el: "μηχανικός",
        },
        description:
            "A role for developers. Claimable by game devs, website devs, and security managers.",
        description_localizations: {
            tr: "Geliştiriciler için bir rol. Oyun, web ve güvenlik geliştiricileri tarafından alınabilir.",
            fr: "Un rôle pour les développeurs. Réclamable par les développeurs de jeux, de sites Web et les responsables de la sécurité.",
            de: "Eine Rolle für Entwickler. Anspruchsberechtigt sind Spieleentwickler, Webentwickler und Sicherheitsmanager.",
            "pt-BR":
                "Um papel para desenvolvedores. Pode ser reivindicado por desenvolvedores de jogos, de sites e gerentes de segurança.",
            el: "Ένας ρόλος για προγραμματιστές. Μπορεί να διεκδικηθεί από προγραμματιστές παιχνιδιών, ιστοσελίδων και διαχειριστές ασφαλείας.",
        },
        type: 7, // boolean_eq
    },
    {
        key: "is_mod",
        name: "enforcer",
        name_localizations: {
            tr: "uygulayıcı",
            fr: "exécuteur",
            de: "vollstrecker",
            "pt-BR": "executor",
            el: "εκτελεστής",
        },
        description:
            "A role for moderators. Claimable by users who moderate content.",
        description_localizations: {
            tr: "Moderatörler için bir rol. İçeriği denetleyen kullanıcılar tarafından alınabilir.",
            fr: "Un rôle pour les modérateurs. Réclamable par les utilisateurs qui modèrent le contenu.",
            de: "Eine Rolle für Moderatoren. Anspruchsberechtigt sind Benutzer, die Inhalte moderieren.",
            "pt-BR":
                "Um papel para moderadores. Pode ser reivindicado por usuários que moderam conteúdo.",
            el: "Ένας ρόλος για συντονιστές. Μπορεί να διεκδικηθεί από χρήστες που εποπτεύουν περιεχόμενο.",
        },
        type: 7, // boolean_eq
    },
    {
        key: "is_ads",
        name: "promoter",
        name_localizations: {
            tr: "tanıtıcı",
            fr: "promoteur",
            de: "förderer",
            "pt-BR": "promotor",
            el: "προωθητής",
        },
        description:
            "A role for advertisers. Claimable by users who manage ads or promotions.",
        description_localizations: {
            tr: "Reklamcılar için bir rol. Reklam veya promosyon yöneten kullanıcılar tarafından alınabilir.",
            fr: "Un rôle pour les annonceurs. Réclamable par les utilisateurs qui gèrent les publicités ou les promotions.",
            de: "Eine Rolle für Werbetreibende. Anspruchsberechtigt sind Benutzer, die Anzeigen oder Werbeaktionen verwalten.",
            "pt-BR":
                "Um papel para anunciantes. Pode ser reivindicado por usuários que gerenciam anúncios ou promoções.",
            el: "Ένας ρόλος για διαφημιστές. Μπορεί να διεκδικηθεί από χρήστες που διαχειρίζονται διαφημίσεις ή προωθήσεις.",
        },
        type: 7, // boolean_eq
    },
    {
        key: "is_owner",
        name: "founder",
        name_localizations: {
            tr: "kurucu",
            fr: "fondateur",
            de: "gründer",
            "pt-BR": "fundador",
            el: "ιδρυτής",
        },
        description:
            "A role for owners. Claimable by users who are the owner of the project.",
        description_localizations: {
            tr: "Sahipler için bir rol. Projenin sahibi olan kullanıcılar tarafından alınabilir.",
            fr: "Un rôle pour les propriétaires. Réclamable par les utilisateurs qui sont propriétaires du projet.",
            de: "Eine Rolle für Eigentümer. Anspruchsberechtigt sind Benutzer, die Eigentümer des Projekts sind.",
            "pt-BR":
                "Um papel para proprietários. Pode ser reivindicado por usuários que são donos do projeto.",
            el: "Ένας ρόλος για ιδιοκτήτες. Μπορεί να διεκδικηθεί από χρήστες που είναι οι ιδιοκτήτες του έργου.",
        },
        type: 7, // boolean_eq
    },
    {
        key: "is_contrubitor",
        name: "contributor",
        name_localizations: {
            tr: "katkıda bulunan",
            fr: "contributeur",
            de: "mitwirkender",
            "pt-BR": "contribuidor",
            el: "εισερχόμενος",
        },
        description:
            "A role for contributors. Claimable by users who have contributed to the project.",
        description_localizations: {
            tr: "Katkıda bulunanlar için bir rol. Projeye katkıda bulunan kullanıcılar tarafından alınabilir.",
            fr: "Un rôle pour les contributeurs. Réclamable par les utilisateurs qui ont contribué au projet.",
            de: "Eine Rolle für Mitwirkende. Anspruchsberechtigt sind Benutzer, die zum Projekt beigetragen haben.",
            "pt-BR":
                "Um papel para contribuidores. Pode ser reivindicado por usuários que contribuíram para o projeto.",
            el: "Ένας ρόλος για εισερχόμενους. Μπορεί να διεκδικηθεί από χρήστες που έχουν συνεισφέρει στο έργο.",
        },
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
