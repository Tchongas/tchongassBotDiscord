const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { Client, Collection,Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('../config.json');

const { fetchData } = require('./fetchData');


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	client.user.setActivity({
		name: 'SeedInject 2.0',
		type: ActivityType.Streaming,
		url: 'https://www.youtube.com/watch?v=SWmOeFptbYw',
	});
});


client.login(token);

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
        
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

function resetPagination() {
    start = 1;
    end = 11;
    pag = 1;
	console.log("resetPagination");
}

setInterval(resetPagination, 300000);

let start = 1;
let end = 11;
let pag = 1;


client.on('interactionCreate', async interaction => {


    if (!interaction.isButton()) return;

    if (interaction.customId === 'next') {
        try {
			pag++;
            const newData = await fetchData(start + 10, end + 10);
            const newEmbed = new EmbedBuilder()
                .setTitle(`Ranking 1.16 RSG :flag_br: Pag ${pag}`)
                .setColor(0x00FF00)
                .setDescription('Leaderboard "Completa": https://tchongas.github.io/StateRanking/BrasilRanking/brRanking.html');

            newData.forEach((row, index) => {
                newEmbed.addFields([{ name: '\u200B', value: row.join('     '), inline: false }]);
            });

            await interaction.update({ 
                embeds: [newEmbed]
            });
			start = start + 10;
			end = end + 10;
			console.log(start, end);
        } catch (error) {
            console.error('Error fetching new data:', error);
        }
    } else if (interaction.customId === 'back') {
        try {
			pag--;
            const newData = await fetchData(start - 10, end - 10);
            const newEmbed = new EmbedBuilder()
                .setTitle(`Ranking 1.16 RSG :flag_br: Pag ${pag}`)
                .setColor(0x00FF00)
                .setDescription('Leaderboard "Completa": https://tchongas.github.io/StateRanking/BrasilRanking/brRanking.html');

            newData.forEach((row, index) => {
                newEmbed.addFields([{ name: '\u200B', value: row.join('     '), inline: false }]);
            });

            await interaction.update({ 
                embeds: [newEmbed]
            });
			start = start - 10;
			end = end - 10;
			console.log(start, end);
			
        } catch (error) {
            console.error('Error fetching new data:', error);
        }
    }
});