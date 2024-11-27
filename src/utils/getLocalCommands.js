const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (exceptions = []) => {
  let localCommands = [];

  const commandCategories = getAllFiles(
    path.join(__dirname, "..", "commands"),
    true
  );

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);

      if (exceptions.includes(commandObject.name)) {
        continue;
      }

      // Log the name of each command to identify where the undefined name comes from
      console.log(
        `Loaded command: ${
          commandObject.name || "undefined"
        } from ${commandFile}`
      );

      if (!commandObject.name) {
        console.error(
          `Error: Command file ${commandFile} is missing a valid name`
        );
      }

      localCommands.push(commandObject);
    }
  }

  console.log(`Loaded ${localCommands.length} commands.`);
  return localCommands;
};
