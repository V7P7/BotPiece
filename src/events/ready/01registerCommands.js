const { testServer } = require("../../../config.json"); // Assuming testServer is an array now
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();

    // Loop through each test server ID
    for (const serverId of testServer) {
      const applicationCommands = await getApplicationCommands(
        client,
        serverId
      );

      for (const localCommand of localCommands) {
        const { name, description, options } = localCommand;

        const existingCommand = await applicationCommands.cache.find(
          (cmd) => cmd.name === name
        );

        if (existingCommand) {
          if (localCommand.deleted) {
            await applicationCommands.delete(existingCommand.id);
            console.log(`🗑 Deleted command "${name}" in server ${serverId}.`);
            continue;
          }

          if (areCommandsDifferent(existingCommand, localCommand)) {
            await applicationCommands.edit(existingCommand.id, {
              description,
              options,
            });

            console.log(`🔁 Edited command "${name}" in server ${serverId}.`);
          }
        } else {
          if (localCommand.deleted) {
            console.log(
              `⏩ Skipping registering command "${name}" in server ${serverId} as it's set to delete.`
            );
            continue;
          }

          await applicationCommands.create({
            name,
            description,
            options,
          });

          console.log(`👍 Registered command "${name}" in server ${serverId}.`);
        }
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
