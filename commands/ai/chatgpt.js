const {
    _ai
} = require("lowline.ai");

module.exports = {
    name: "chatgpt",
    aliases: ["lowline"],
    description: "Chat with AI",
    category: "ai",
    permissions: [],
    action: "typing",
    async execute(bot, ctx, input, tools) {
        const {
            text
        } = input;

        if (!text) return ctx.reply(`📌 Send a text!`);

        try {
            let chatThread = config.db.get(`user.${ctx.from.id}.chatThread`) || [];

            chatThread.push({
                name: ` ${ctx.from.first_name} ${ctx.from.last_name || ""}`,
                role: "user",
                content: text,
            });

            const res = await _ai.suggestChatResponse({
                intent: text,
                chat_thread: chatThread
            });

            chatThread.push({
                name: "Bot",
                role: "bot",
                content: res.result,
            });

            config.db.set(`user.${ctx.from.sender}.chatThread`, chatThread);

            return ctx.reply(res.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ An error occurred: ${error.message}`);
        }
    }
};