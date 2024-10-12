// Declare Global Chat-Based Functions

export function chat(message: string) {
    const replicated_storage = game.GetService('ReplicatedStorage');
    const text_chat = game.GetService('TextChatService');

    if (replicated_storage.FindFirstChild('DefaultChatSystemChatEvents')) {
        const folder = replicated_storage.FindFirstChild('DefaultChatSystemChatEvents') as Folder;
        const event = folder?.FindFirstChild('SayMessageRequest') as RemoteEvent;

        event.FireServer(message, 'All');
    } else {
        const text_channel = text_chat.FindFirstChild('TextChannels');
        const main = text_channel?.FindFirstChild('RBXGeneral');

        if (main) {
            (main as TextChannel).SendAsync(message);
        }
    }
}