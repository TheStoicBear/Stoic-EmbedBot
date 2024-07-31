const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

if (!clientId || !guildId || !token) {
    console.error('Missing required environment variables: CLIENT_ID, GUILD_ID, or DISCORD_TOKEN.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const allowedUsers = new Set(); // In-memory store for allowed users

const rest = new REST({ version: '10' }).setToken(token);

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    try {
        // Delete the bot's guild commands
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
        console.log('Successfully deleted all guild commands for this bot.');

        // Delete the bot's global commands
        await rest.put(Routes.applicationCommands(clientId), { body: [] });
        console.log('Successfully deleted all global commands for this bot.');

        // Register the commands
        const commands = [
            new SlashCommandBuilder()
                .setName('embed')
                .setDescription('Create an embed')
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('Title of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Description of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('Color of the embed in hex (default: #0099ff)')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('URL of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('author_name')
                        .setDescription('Author name of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('author_icon_url')
                        .setDescription('Author icon URL of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('author_url')
                        .setDescription('Author URL of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('thumbnail')
                        .setDescription('Thumbnail URL of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('image')
                        .setDescription('Image URL of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('footer_text')
                        .setDescription('Footer text of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('footer_icon_url')
                        .setDescription('Footer icon URL of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('field_name')
                        .setDescription('Field name of the embed')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('field_value')
                        .setDescription('Field value of the embed')
                        .setRequired(false))
                .addBooleanOption(option =>
                    option.setName('field_inline')
                        .setDescription('Whether the field is inline')
                        .setRequired(false)),

            new SlashCommandBuilder()
                .setName('allow-embed')
                .setDescription('Allow a user to create embeds')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to allow')
                        .setRequired(true)),

            new SlashCommandBuilder()
                .setName('deny-embed')
                .setDescription('Deny a user the ability to create embeds')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to deny')
                        .setRequired(true))
        ];

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands.map(command => command.toJSON()) }
        );
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options, user, channel } = interaction;

    if (commandName === 'embed') {
        if (!allowedUsers.has(user.id)) {
            await interaction.reply({ content: 'You are not allowed to create embeds.', ephemeral: true });
            return;
        }

        const title = options.getString('title');
        const description = options.getString('description');
        const color = options.getString('color') ? parseInt(options.getString('color').replace('#', ''), 16) : null;
        const url = options.getString('url');
        const authorName = options.getString('author_name');
        const authorIconUrl = options.getString('author_icon_url');
        const authorUrl = options.getString('author_url');
        const thumbnail = options.getString('thumbnail');
        const image = options.getString('image');
        const footerText = options.getString('footer_text');
        const footerIconUrl = options.getString('footer_icon_url');
        const fieldName = options.getString('field_name');
        const fieldValue = options.getString('field_value');
        const fieldInline = options.getBoolean('field_inline');

        const embed = new EmbedBuilder();

        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (color) embed.setColor(color);
        if (url) embed.setURL(url);
        if (authorName || authorIconUrl || authorUrl) {
            embed.setAuthor({ name: authorName, iconURL: authorIconUrl, url: authorUrl });
        }
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (image) embed.setImage(image);
        if (footerText || footerIconUrl) {
            embed.setFooter({ text: footerText, iconURL: footerIconUrl });
        }
        if (fieldName && fieldValue) {
            embed.addFields({ name: fieldName, value: fieldValue, inline: fieldInline });
        }

        // Send the embed to the channel
        await channel.send({ embeds: [embed] });
        // Acknowledge the command interaction
        await interaction.reply({ content: 'Embed sent to the channel.' });
    } else if (commandName === 'allow-embed' || commandName === 'deny-embed') {
        if (!interaction.memberPermissions.has('ADMINISTRATOR')) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const targetUser = options.getUser('user');

        if (commandName === 'allow-embed') {
            allowedUsers.add(targetUser.id);
            await interaction.reply({ content: `User <@${targetUser.id}> is now allowed to create embeds.` });
        } else if (commandName === 'deny-embed') {
            allowedUsers.delete(targetUser.id);
            await interaction.reply({ content: `User <@${targetUser.id}> is no longer allowed to create embeds.` });
        }
    }
});

client.login(token);
