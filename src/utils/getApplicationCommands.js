module.exports = async (client, guildId) => {
  let applicationCommands;

  if (guildId) {
    const guild = await client.guilds.fetch(guildId);
    // Check if guild has commands available
    if (guild && guild.commands) {
      applicationCommands = guild.commands;
    } else {
      throw new Error(`Commands not available for guild with ID: ${guildId}`);
    }
  } else {
    // Check if client.application.commands exists and is a valid object
    if (client.application && client.application.commands) {
      applicationCommands = client.application.commands;
    } else {
      throw new Error("Application commands are not available");
    }
  }

  // Ensure fetch method is available
  if (applicationCommands && typeof applicationCommands.fetch === "function") {
    await applicationCommands.fetch();
    return applicationCommands;
  } else {
    throw new Error("fetch method not available on application commands");
  }
};
