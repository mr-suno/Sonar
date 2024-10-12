-- Compiled with roblox-ts v3.0.0
-- Contains Files for Fixes;
-- Like: loadstring
local function load_url(url)
	local response = game:HttpGetAsync(url)
	local func, err = loadstring(response)
	if func then
		return func()
	else
		error(err)
	end
end
return {
	load_url = load_url,
}
