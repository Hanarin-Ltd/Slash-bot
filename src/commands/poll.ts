import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from "discord.js";

const PollCommand: Command = {
  name: "투표",
  description: "다른 사람들의 의견을 받을수 있어요!",
  options: {
    내용: {
      description: "투표의 내용입니다",
      required: true,
      minLength: 0,
      maxLength: 100,
      type: "String",
    },
  },
  async executes(_, interaction) {
    const topic = interaction.options.getString('내용') || '';
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setFooter({ text: `🤚 투표가 시작됨` })
      .setTimestamp()
      .setTitle("📌 투표가 시작 되었습니다")
      .setDescription(topic)
      .addFields({ name: '작성자', value: `<@${interaction.user.id}>`, inline: false });

    const msg = await interaction.reply({ embeds: [embed] });
    const msgfetch = await msg.fetch();
    await msgfetch.react('✅');
    await msgfetch.react('❌');
  },
};

export default PollCommand;