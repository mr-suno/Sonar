import chats from "shared/chat";

export function commands() {
    chats.handle(function(message: string) {
        print(message);
    });
}
