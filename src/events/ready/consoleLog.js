const { ActivityType } = require("discord.js");
module.exports = (client) => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log("⛵ Ahoy! BotPiece is ready to sail! 🏴‍☠️");
  client.user.setPresence({
    activities: [
      {
        name: "Eating all the meat 🍗 | Setting sail for adventure ⛵",
        type: ActivityType.Custom,
        state: "Eating all the meat 🍗",
        details: "Setting sail for adventure ⛵",
        timestamps: {
          start: new Date(1507665886000), // Convert timestamp to date
          end: new Date(1507665886000),
        },
      },
    ],
    status: "online",
  });
};
