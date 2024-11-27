const { Client, Interaction } = require("discord.js");
const User = require("../../models/User");

const dailyAmount = 1000;

module.exports = {
  name: "daily",
  description: "Collect your dailies!",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          const nextDailyTime = new Date(user.lastDaily);
          nextDailyTime.setDate(nextDailyTime.getDate() + 1); // Next day at the same time

          const timeLeft = nextDailyTime - new Date();
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          interaction.editReply(
            `You've claimed today's bounty! Come back in **${hours}h ${minutes}m ${seconds}s** for more treasure, future Pirate King! ☠️`
          );
          return;
        }

        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(
        `${dailyAmount} was added to your balance. Your new balance is ${user.balance}`
      );
    } catch (error) {
      console.log(`Error with /daily: ${error}`);
    }
  },
};
