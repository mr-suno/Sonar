import chats from "shared/chat";
import { load_url } from "shared/remixed";
import { commands } from "shared/commands";

// Define library

interface Fluent {
    Notify(data: {}): void
}

// Main function

function main() {
    const fluent = load_url('https://github.com/mr-suno/Fluent/releases/latest/download/main.lua') as Fluent;
    
    // const n_emoji = '\u{274C}  ';
    const y_emoji = '\u{2705}  ';

    if (getgenv().Sonar === true) { (getgenv().CancelSonar as Function)() }

    fluent.Notify({
        Title: y_emoji + 'Sonar Now Loading',
        Content: 'Sonar Bot will automatically load when this is finished.',
        Duration: 5
    });
    
    const players = game.GetService('Players');

    const local_player = players.LocalPlayer as Player;
    let char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];

    commands(); // Allows for User Commands

    char.SetAttribute('hasSonar', true); // Alternate Global Set

    chats.chat('Sonar Bot loaded, use .cmds to say commands. -> .c 4 Credits <|:D');
}

if (!game.Loaded) { print('Game not loaded') } else { main() }

// Defining Globals

getgenv().Sonar = true;

getgenv().CancelSonar = function() {
    const players = game.GetService('Players');

    const local_player = players.LocalPlayer as Player;
    const char = local_player.Character ?? local_player.CharacterAdded.Wait()[0];

    if (char.GetAttribute('hasSonar') === true) {
        // print('Got attribute || ' + char.GetAttribute('hasSonar'))
    
        char.SetAttribute('hasSonar', false);
    }

    getgenv().Sonar = false;
}
