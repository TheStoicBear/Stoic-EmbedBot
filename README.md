# Stoic-EmbedBot

Stoic-EmbedBot is a Discord bot that allows users to create and manage embeds in a Discord server. This bot includes commands for creating embeds and managing user permissions to create embeds.

## Features

- **/embed**: Create and send an embed to the channel.
- **/allow-embed [user id]**: Allow a user to create embeds.
- **/deny-embed [user id]**: Deny a user the ability to create embeds.

## Prerequisites

Before running the bot, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 18.0.0 or later)

## Installation

1. **Clone or Download the Repository:**

   Clone the repository using Git:
   
   git clone https://github.com/thestoicbear/stoic-embedbot.git
   
   Alternatively, if you prefer to download the repository as a ZIP file, visit [Stoic-EmbedBot GitHub Repository](https://github.com/thestoicbear/stoic-embedbot) and click on the "Code" button, then "Download ZIP."

2. **Navigate to the Project Folder:**
   
   cd stoic-embedbot

3. **Initialize the Project and Install Dependencies:**
   ```
   npm init -y
   npm install @discordjs/rest discord-api-types @discordjs/builders  
   ```
4. **Create a `.env` File:**

   In the project folder, create a file named `.env` and add the following environment variables:
   ```
   CLIENT_ID=your-discord-application-client-id
   GUILD_ID=your-discord-server-id
   DISCORD_TOKEN=your-discord-bot-token
   ```
   Replace `your-discord-application-client-id`, `your-discord-server-id`, and `your-discord-bot-token` with your actual values.

## Running the Bot

To start the bot, run:
```
   node index.js
```
The bot will log in and register the commands on your Discord server.

## Commands

- **/embed**: Creates and sends an embed to the channel. Requires the user to be allowed to create embeds.
  - `title`: The title of the embed.
  - `description`: The description of the embed.
  - `color`: The color of the embed (in hex, default: #0099ff).
  - `url`: The URL for the embed.
  - `author_name`: The name of the embed author.
  - `author_icon_url`: The icon URL for the embed author.
  - `author_url`: The URL for the embed author.
  - `thumbnail`: The URL for the embed thumbnail.
  - `image`: The URL for the embed image.
  - `footer_text`: The footer text for the embed.
  - `footer_icon_url`: The footer icon URL for the embed.
  - `field_name`: The name of the field in the embed.
  - `field_value`: The value of the field in the embed.
  - `field_inline`: Whether the field is inline (true/false).

- **/allow-embed [user id]**: Allows the specified user to create embeds. Requires the issuer to have the `ADMINISTRATOR` permission.

- **/deny-embed [user id]**: Denies the specified user the ability to create embeds. Requires the issuer to have the `ADMINISTRATOR` permission.

## Troubleshooting

- **Missing Environment Variables**: Ensure that you have properly set the `CLIENT_ID`, `GUILD_ID`, and `DISCORD_TOKEN` in the `.env` file.
- **Invalid Token**: Double-check that your Discord bot token is correct and has not expired.
- **Permission Issues**: Ensure that the bot has the necessary permissions in your Discord server to send messages and manage commands.



## Contact
# [Discord](https://discord.gg/mu7u7zjnKr)
For any issues or contributions, please contact [contact@thestoicebear.dev](mailto:contact@thestoicebear.dev).

---

Happy coding!
