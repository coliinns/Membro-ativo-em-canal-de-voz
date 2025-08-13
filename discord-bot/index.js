coloque o token do bot MTM5OTg3NDU2OTU3MzI0MDk5Mw.GWTf3G.JWzdkMcl4JRzp-eP4FcG29qnSTci92Mb_MDtE4               direto no arquivo index           // Importações
const express = require("express");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

// =========================
// Servidor web para monitoramento
// =========================
const app = express();

app.get("/", (req, res) => {
  console.log("⚡ Ping recebido");
  res.send("Bot está ativo!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor web rodando na porta ${PORT}`);
});

// =========================
// Configuração do bot Discord
// =========================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 🔹 Login via variável de ambiente
if (!process.env.TOKEN) {
  console.error("❌ ERRO: A variável de ambiente TOKEN não foi definida.");
  process.exit(1);
}

client.login(process.env.TOKEN);

// Configurações
const CANAL_TEXTO_ID = "1360720462518157514";
const VOICE_CHANNELS = [
  "1377710109115027547",
  "1377712406574268536",
  "1377712449674809587",
  "1377712615366725773",
];

const lastAnnounceTime = new Map();
const userMessages = new Map();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutos

function gerarEspacosProporcionais(nickLength) {
  const multiplicador = 1.2;
  const qtdEspacos = Math.max(0, Math.floor((20 - nickLength) * multiplicador));
  return "\u200B".repeat(qtdEspacos);
}

// Quando o bot iniciar
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  const canalTexto = client.channels.cache.get(CANAL_TEXTO_ID);
  if (canalTexto) {
    const embed = new EmbedBuilder()
      .setColor("#FFEC00")
      .setDescription(
        `<:verified:1405172419827732530> **Bot online!** pronto para monitorar, registrar e divulgar conexões de membros nos canais de voz do servidor!`
      );
    canalTexto.send({ embeds: [embed] });
  }
});

// Entrada e saída de voz
client.on("voiceStateUpdate", (oldState, newState) => {
  const memberId = newState.member.id;

  // Entrada
  if (!oldState.channelId && newState.channelId) {
    if (VOICE_CHANNELS.includes(newState.channelId)) {
      const now = Date.now();
      const lastTime = lastAnnounceTime.get(memberId) || 0;

      if (now - lastTime >= COOLDOWN_MS) {
        const canalTexto = newState.guild.channels.cache.get(CANAL_TEXTO_ID);
        if (canalTexto) {
          const avatarURL = newState.member.user.displayAvatarURL({ size: 512, dynamic: true });
          const nickLength = newState.member.user.username.length;
          const espacos = gerarEspacosProporcionais(nickLength);

          const embed = new EmbedBuilder()
            .setColor("#FFEC00")
            .setDescription(
              `<a:ansflash13:1405160790419443762> <@${memberId}> **está ativo no canal** <#${newState.channelId}>\n${espacos}Junte-se para ser ajudado ou farmar dinheiro em equipe. <a:moneybag:1405178051935076392>`
            )
            .setThumbnail(avatarURL);

          canalTexto.send({ embeds: [embed] }).then((msg) => {
            userMessages.set(memberId, msg);
          });

          lastAnnounceTime.set(memberId, now);
        }
      }
    }
  }

  // Saída
  if (oldState.channelId && !newState.channelId) {
    if (VOICE_CHANNELS.includes(oldState.channelId)) {
      const msg = userMessages.get(memberId);
      if (msg) {
        msg.delete().catch(() => {});
        userMessages.delete(memberId);
      }
    }
  }
});
