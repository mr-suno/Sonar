-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local chat = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "chat").chat
local load_url = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "remixed").load_url
-- Define library
-- Main function
local function main()
	local initial_time = tick()
	local fluent = load_url("https://github.com/mr-suno/Fluent/releases/latest/download/main.lua")
	local n_emoji = "\u{274C}  "
	local y_emoji = "\u{2705}  "
	if getgenv().Sonar == true then
		getgenv().CancelSonar()
	end
	fluent:Notify({
		Title = y_emoji .. "Sonar Now Loading",
		Content = "Sonar Bot will automatically load when this is finished.",
		Duration = 5,
	})
	local players = game:GetService("Players")
	local local_player = players.LocalPlayer
	local char = local_player.Character or (local_player.CharacterAdded:Wait())
	local root_part = char:FindFirstChild("HumanoidRootPart") or char:WaitForChild("HumanoidRootPart", 15)
	char:SetAttribute("hasSonar", true)
	chat("Sonar Bot loaded, use .cmds to say commands. -> .c 4 Credits <|:D")
end
if not game.Loaded then
	print("Game not loaded")
else
	main()
end
-- Defining Globals
getgenv().Sonar = true
getgenv().CancelSonar = function()
	local players = game:GetService("Players")
	local local_player = players.LocalPlayer
	local char = local_player.Character or (local_player.CharacterAdded:Wait())
	if char:GetAttribute("hasSonar") == true then
		-- print('Got attribute || ' + char.GetAttribute('hasSonar'))
		char:SetAttribute("hasSonar", false)
	end
	getgenv().Sonar = false
end
