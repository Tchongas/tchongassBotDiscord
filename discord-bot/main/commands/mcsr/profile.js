const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { fetchData, fetchDataCabra, fetchDataCabraProfile } = require('../../fetchData');




module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('cabraprofile')
        .setDescription('Ranking de pontos do CABRA!')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Nome do runner')
                .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString("nome").toLowerCase();
        try {
            const fetchDataResult = await fetchDataCabraProfile(0,30);
            if (!fetchDataResult) {
                throw new Error('No data returned from fetchData');
            }

            let rowIndex = 22;
            for (let i = 0; i < fetchDataResult.length; i++) {
                if (fetchDataResult[i][1] === username) { // Assuming the second column is at index 1
                    rowIndex = i;
                    break;
                
                }
            }

            const embed = new EmbedBuilder()
            .setAuthor({
              name: "INFO CABRA",
              iconURL: "https://media.discordapp.net/attachments/807702138834649178/816116272638722088/Cristal_Brasil.png?ex=66aed602&is=66ad8482&hm=9a140bc80f002a1794990898f223bd96635c1524ec2710476995585800545e85&=&format=webp&quality=lossless&width=605&height=605",
            })
            .setTitle("Info de " + fetchDataResult[rowIndex][1] + " (" + fetchDataResult[rowIndex][0] + "):")
            .addFields(
              {
                name: "Estrelas",
                value: fetchDataResult[rowIndex][2],
                inline: false
              },
              {
                name: "Titulos :first_place:",
                value: fetchDataResult[rowIndex][3],
                inline: true
              },
              {
                name: "Vice :second_place:",
                value: fetchDataResult[rowIndex][4],
                inline: true
              },
              {
                name: "Participação :medal:",
                value:  fetchDataResult[rowIndex][5],
                inline: true
              },
            )
            .setImage(fetchDataResult[rowIndex][6])
            .setColor("#00ff55")
            .setFooter({
              text: "/cabraranking para ver o top 6",
              iconURL: "https://slate.dan.onl/slate.png",
            });
  
          await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error during command execution:', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    }
};
