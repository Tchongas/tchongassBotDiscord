const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { fetchData, fetchDataCabra } = require('../../fetchData');




module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('cabraranking')
        .setDescription('Ranking de pontos do CABRA!'),
    async execute(interaction) {
        try {
            const fetchDataResult = await fetchDataCabra(0,7);
            if (!fetchDataResult) {
                throw new Error('No data returned from fetchData');
            }

            const embed = new EmbedBuilder()
                .setTitle('Ranking do passe do CABRA')
                .setColor(0x00FF00)
                .setDescription('Info sobre os premios: <#1260481875156144271> \n Apenas o top 6 aqui \n Para ver seu perfil **/cabraprofile nome**')

            fetchDataResult.forEach((row, index) => {
                embed.addFields([{ name: '\u200B', value: row.join('     '), inline: false }]);
            });

            await interaction.reply({ 
                embeds: [embed],
            });
        } catch (error) {
            console.error('Error during command execution:', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    }
};
