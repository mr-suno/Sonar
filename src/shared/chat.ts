// Declare Global Chat-Based Functions

interface Chats {
    chat(data: {}): void,
    handle(callback: (message: string) => void): void;
}

// Constants

const replicated_storage = game.GetService('ReplicatedStorage');
const text_chat = game.GetService('TextChatService');
const players = game.GetService('Players');

const local_player = players.LocalPlayer as Player;

const chat_type = text_chat.ChatVersion;

const chats: Chats = {
    /* Makes Your Player Chat for You */

    chat: function(message: string) {
        if (chat_type === Enum.ChatVersion.LegacyChatService) {
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
    },

    /* Listens & Returns Messages You Send */

    handle: function(callback: (message: string) => void) {
        if (chat_type === Enum.ChatVersion.LegacyChatService) {
            local_player.Chatted.Connect(function(message: string) {
                return callback(message);
            })
        } else {
            text_chat.MessageReceived.Connect(function(message: TextChatMessage) {
                const author = message.TextSource as unknown;

                if (author === local_player.Name) {
                    return callback(message.Text);
                }
            })
        }
    }
}

export default chats;
