# Discord Bot Monitor de Voz

Bot do Discord para monitorar entrada e saída de membros em canais de voz e anunciar em um canal de texto.

## 🚀 Como rodar localmente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` e adicione seu token:
```env
TOKEN=SEU_TOKEN_DO_DISCORD
```

4. Inicie o bot:
```bash
npm start
```

## ☁ Deploy no Render

1. Crie um Web Service no [Render](https://render.com/)
2. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Adicione a variável de ambiente:
   - **KEY**: `TOKEN`
   - **VALUE**: Seu token do bot do Discord
4. Deploy e aproveite!
