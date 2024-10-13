import chats from "shared/chat";
import { load_url } from "./remixed";

// Define library

interface Fluent {
    Notify(data: {}): void
}

// Constants

const players = game.GetService('Players');
const teleport = game.GetService('TeleportService');

const local_player = players.LocalPlayer as Player;
let char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];

let prefix = '.'
let client_stop = false;

const fluent = load_url('https://github.com/mr-suno/Fluent/releases/latest/download/main.lua') as Fluent;

// Registry

const reg: { [key: string]: () => void } = {};

// Functions

function command(value: string, ...aliases: string[]) {
    return function(callback: () => void) {
        reg[value] = callback;

        for (const alias of aliases) {
            reg[alias] = reg[value];
        }
    }
}

// Create Commands

command('reset', 're', 'oof')(function() {
    if (char === undefined) {
        char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];
    }

    const root = char.FindFirstChild('HumanoidRootPart') ?? char.WaitForChild('HumanoidRootPart', 15) as BasePart;
    const humanoid = char.FindFirstChild('Humanoid') ?? char.WaitForChild('Humanoid') as Humanoid;

    const old_pos = (root as BasePart).CFrame;

    (humanoid as Humanoid).Health = 0;

    local_player.CharacterAdded.Connect(function() {
        char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];
        const root = char.FindFirstChild('HumanoidRootPart') ?? char.WaitForChild('HumanoidRootPart', 15) as BasePart;

        task.wait(0.25);

        (root as BasePart).CFrame = old_pos;        
    });

    chats.chat('🌙  Sonar → Done! I will come back when I respawn.');
});

command('credits', 'c', 'dev')(function() {
    chats.chat('🌙  Sonar → Sonar Bot made in TypeScript by Suno! (mr-suno on Git Hub)');
});

command('ul', 'unload','stop')(function() {
    getgenv().Sonar = false;
    
    client_stop = true; // Stop commands from being ran

    fluent.Notify({
        Title: '🌙  Sonar Closed',
        Content: 'Commands will no longer be responsive, reload the script to keep using commands.',
        Duration: 5
    })
});

command('help', 'guide', 'cmds')(function() {
    chats.chat('🌙  Sonar → .credits / .c / .dev, .help / .guide / .cmds, .reset / .re / .oof');

    task.wait(3.25);

    chats.chat('Whitelisted Only: .ul / .unload / .stop');
});

// Read Messages

export function commands() {
    chats.handle(function(message: string) {
        if (client_stop === false) {
            if (message.sub(1, 1) === prefix) {
                const lowered = message.sub(2).lower();
    
                if (reg[lowered]) {
                    reg[lowered]();
                } else {
                    warn('Command does not exist. Command tried: ' + lowered);
                }
            }
        }
    });
}
