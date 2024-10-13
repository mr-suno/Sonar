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
    return function(callback: (...args: string[]) => void) {
        reg[value] = callback;

        for (const alias of aliases) {
            reg[alias] = callback;
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
});

command('credits', 'c', 'dev')(function() {
    chats.chat('🌙  Sonar → Sonar Bot made in TypeScript by Suno! (mr-suno on Git Hub)');
});

// command('ul', 'unload','stop')(function() {
//     getgenv().Sonar = false;
    
//     client_stop = true; // Stop commands from being ran

//     fluent.Notify({
//         Title: '🌙  Sonar Closed',
//         Content: 'Commands will no longer be responsive, reload the script to keep using commands.',
//         Duration: 5
//     })
// });

command('jump')(function() {
    if (char === undefined) {
        char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];
    }

    const humanoid = char.FindFirstChild('Humanoid') ?? char.WaitForChild('Humanoid', 15) as Humanoid;

    (humanoid as Humanoid).Jump = true;
});

command('gravity', 'grav')(function(...args: string[]) {
    const gravity: string = args.join(' ');
    let grav_value = tonumber(gravity);

    if (grav_value !== undefined && type(grav_value) === 'number') {
        if (grav_value < 50) {
            grav_value = 50;

            chats.chat('🌙  Sonar → Changed local gravity to ' + tostring(grav_value) + ' (Reached limit)');
        } else {
            chats.chat('🌙  Sonar → Changed local gravity to ' + tostring(grav_value));
        }
        
        game.Workspace.Gravity = grav_value;
    }
});

command('hipheight', 'height', 'hh')(function(...args: string[]) {
    const height: string = args.join(' ');
    let hei_value = tonumber(height);

    if (hei_value !== undefined && type(hei_value) === 'number') {
        if (hei_value > 50) {
            hei_value = 50;
            
            chats.chat('🌙  Sonar → Changed hipheight to ' + tostring(hei_value) + ' (Reached limit)');
        } else {
            chats.chat('🌙  Sonar → Changed hipheight to ' + tostring(hei_value));
        }

        if (char === undefined) {
            char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];
        }

        const humanoid = char.FindFirstChild('Humanoid') ?? char.WaitForChild('Humanoid', 15) as Humanoid;

        (humanoid as Humanoid).HipHeight = hei_value;
    }
});

command('help', 'guide', 'cmds')(function() {
    chats.chat('🌙  Sonar → .credits - .c - .dev || .help - .guide - .cmds || .reset - .re - .oof || Args: <number> → .hipheight - .height - .hh || Args: <number> → .grav - .gravity');

    // task.wait(3.25);

    // chats.chat('⚙️  Owner Only → .ul - .unload - .stop');
});

// Read Messages

export function commands() {
    chats.handle(function(message: string) {
        if (client_stop === false) {
            if (message.sub(1, 1) === prefix) {
                const lowered = message.sub(2).lower();
                const parts = lowered.split(' ');

                const cmd = parts[0];
                const args: string[] = [];

                for (let i  = 1; i < parts.size(); i++) {
                    args.push(parts[i]);
                }
    
                if (reg[cmd]) {
                    (reg[cmd] as (...args: string[]) => void)(...args);
                } else {
                    warn('Command does not exist. Command tried: ' + lowered);
                }
            }
        }
    });
}
