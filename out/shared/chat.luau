-- Compiled with roblox-ts v3.0.0
-- Declare Global Chat-Based Functions
local function chat(message)
	local replicated_storage = game:GetService("ReplicatedStorage")
	local text_chat = game:GetService("TextChatService")
	if replicated_storage:FindFirstChild("DefaultChatSystemChatEvents") then
		local folder = replicated_storage:FindFirstChild("DefaultChatSystemChatEvents")
		local _result = folder
		if _result ~= nil then
			_result = _result:FindFirstChild("SayMessageRequest")
		end
		local event = _result
		event:FireServer(message, "All")
	else
		local text_channel = text_chat:FindFirstChild("TextChannels")
		local _main = text_channel
		if _main ~= nil then
			_main = _main:FindFirstChild("RBXGeneral")
		end
		local main = _main
		if main then
			main:SendAsync(message)
		end
	end
end
return {
	chat = chat,
}
