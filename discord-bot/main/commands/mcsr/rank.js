const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { fetchData } = require('../../fetchData');




module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Ranking BR de 1.16 RSG!'),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const next = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('->')
            .setStyle(ButtonStyle.Primary);

        const back = new ButtonBuilder()
            .setCustomId('back')
            .setLabel('<-')
            .setStyle(ButtonStyle.Primary);   

        const row = new ActionRowBuilder()
			.addComponents(back, next);

        try {
            const fetchDataResult = await fetchData(0,11);
            if (!fetchDataResult) {
                throw new Error('No data returned from fetchData');
            }

            const embed = new EmbedBuilder()
                .setTitle('Ranking 1.16 RSG :flag_br:')
                .setColor(0x00FF00)
                .setDescription('Leaderboard "Completa": https://tchongas.github.io/StateRanking/BrasilRanking/brRanking.html')

            fetchDataResult.forEach((row, index) => {
                embed.addFields([{ name: '\u200B', value: row.join('     '), inline: false }]);
            });

            await interaction.reply({ 
                embeds: [embed],
                components: [row]
            });
        } catch (error) {
            console.error('Error during command execution:', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    }
};
