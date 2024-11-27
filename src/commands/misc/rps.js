const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

const choices = [
  { name: "Rock", emoji: "🪨", beats: "Scissors" },
  { name: "Paper", emoji: "📃", beats: "Rock" },
  { name: "Scissors", emoji: "✂️", beats: "Paper" },
];

module.exports = {
  name: "rps",
  description: "Play a game of rock, paper, scissors with another user!",
  options: [
    {
      name: "user",
      description: "The user you want to play with!",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    try {
      // Fetch the target user from the interaction options
      const targetUser = interaction.options.getUser("user");

      if (!targetUser) {
        return interaction.reply({
          content: "You need to mention a user to play with!",
          ephemeral: true,
        });
      }

      // Check if the user is trying to play with themselves
      if (interaction.user.id === targetUser.id) {
        return interaction.reply({
          content: "You can't play against yourself!",
          ephemeral: true,
        });
      }

      // Check if the target is a bot
      if (targetUser.bot) {
        return interaction.reply({
          content: "You can't play with a bot!",
          ephemeral: true,
        });
      }

      // Create the embed with initial description
      const embed = new EmbedBuilder()
        .setTitle("Rock Paper Scissors")
        .setDescription(`It's currently ${targetUser}'s turn.`)
        .setColor("Yellow")
        .setTimestamp(new Date());

      // Create the buttons for each choice
      const buttons = choices.map((choice) => {
        return new ButtonBuilder()
          .setCustomId(choice.name)
          .setLabel(choice.name)
          .setStyle(ButtonStyle.Primary)
          .setEmoji(choice.emoji);
      });

      // Create the action row with buttons
      const row = new ActionRowBuilder().addComponents(buttons);

      // Send the reply with the embed and buttons
      const reply = await interaction.reply({
        content: `${targetUser}, You have been challenged to a game of Rock Paper Scissors by ${interaction.user}. To start playing, click one of the buttons below!`,
        embeds: [embed],
        components: [row],
      });

      // Await for the target user to select their choice
      const targetUserInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === targetUser.id,
          time: 30_000,
        })
        .catch(async () => {
          embed.setDescription(
            `Game Over. ${targetUser} did not respond in time.`
          );
          await reply.edit({ embeds: [embed], components: [] });
        });

      if (!targetUserInteraction) return;

      const targetUserChoice = choices.find(
        (choice) => choice.name === targetUserInteraction.customId
      );

      await targetUserInteraction.reply({
        content: `You picked ${targetUserChoice.name} ${targetUserChoice.emoji}`,
        ephemeral: true,
      });

      embed.setDescription(`It's currently ${interaction.user}'s turn.`);
      await reply.edit({
        content: `${interaction.user}, It's your turn now.`,
        embeds: [embed],
      });

      // Await for the initial user to select their choice
      const initialUserInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === interaction.user.id,
          time: 30_000,
        })
        .catch(async () => {
          embed.setDescription(
            `Game Over. ${interaction.user} did not respond in time.`
          );
          await reply.edit({ embeds: [embed], components: [] });
        });

      if (!initialUserInteraction) return;

      const initialUserChoice = choices.find(
        (choice) => choice.name === initialUserInteraction.customId
      );

      let result;

      // Determine the winner
      if (targetUserChoice.beats === initialUserChoice.name) {
        result = `${targetUser} Won!`;
      } else if (initialUserChoice.beats === targetUserChoice.name) {
        result = `${interaction.user} Won!`;
      } else {
        result = "It's a tie!";
      }

      // Update the embed with the game results
      embed.setDescription(
        `${targetUser} picked ${targetUserChoice.name} ${targetUserChoice.emoji}\n` +
          `${interaction.user} picked ${initialUserChoice.name} ${initialUserChoice.emoji}\n\n` +
          result
      );

      await reply.edit({ embeds: [embed], components: [] });
    } catch (error) {
      console.error("Error with /rps command");
      console.error(error);
    }
  },

  data: {
    name: "rps", // The command's name
    description: "Play a game of rock, paper, scissors with another user!", // The description of the command
    dm_permission: false, // Disable the command in DMs
    options: [
      {
        name: "user",
        description: "The user you want to play with!",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
};
