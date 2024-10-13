import chats from "shared/chat";

// Constants

const players = game.GetService('Players');
const teleport = game.GetService('TeleportService');

const local_player = players.LocalPlayer as Player;
let char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];

let prefix = '.'

// Add Pre-Command Handling

local_player.OnTeleport.Connect(function() {
    if (char === undefined) {
        char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];
    }

    if (char.GetAttribute('reloadSonar')) {
        chats.chat('🌙  Sonar → Reloading Sonar Bot..');
    
        queue_on_teleport('loadstring(game:HttpGetAsync(\'https://github.com/mr-suno/Sonar/releases/latest/download/build.lua\'))()');
    }
});

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

command('rj', 'rejoin')(function() {
    if (char === undefined) {
        char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];
    }

    char.SetAttribute('reloadSonar', true);

    teleport.TeleportToPlaceInstance(game.PlaceId, game.JobId, local_player);
});

command('help', 'guide', 'cmds')(function() {
    chats.chat('🌙  Sonar → .credits / .c / .dev, .help / .guide / .cmds, .reset / .re / .oof, .rj / .rejoin');
});

// Read Messages

export function commands() {
    chats.handle(function(message: string) {
        if (message.sub(1, 1) === prefix) {
            const lowered = message.sub(2).lower();

            if (reg[lowered]) {
                reg[lowered]();
            } else {
                warn('Command does not exist. Command tried: ' + lowered);
            }
        }
    });
}
