// Contains Files for Fixes;
// Like: loadstring

export function load_url(url: string) {
    const [response] = game.HttpGetAsync(url);
    const [func, err] = loadstring(response);

    if (func) {
        return func();
    } else {
        throw err;
    }
}