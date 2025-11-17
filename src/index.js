function looksLikeCommit(s) {
    // You can even drop this and always treat second segment as commit if you want
    return /^[0-9a-f]{4,40}$/i.test(s);
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        // extract the hash after @ at the end from url.pathname
        const commitSha = url.pathname.includes("@") ? url.pathname.split("@").pop() : null
        var parts = url.pathname.split("@")[0].split("/").filter(Boolean);
        console.log(`args: ${url.pathname}`)
        console.log(`parts: ${parts}`)
        console.log(`commitSha: ${commitSha}`)

        // Root: no suffix, redirect to github as default
        if (parts.length === 0) {
            return Response.redirect(`https://github.com/ucb-bar`, 302, {
                headers: {
                  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                  "Pragma": "no-cache",
                  "Expires": "0"
                }
            });
        }
        
        // e.g.
        //   /jim/gh        -> "jim/gh"
        //   /saturn        -> "saturn"
        //   /saturn/abc123 -> "saturn/abc123"
        const normalizedPath = parts.join("/");
        const kvKey = `link:${normalizedPath}`;
        
        // 1) Check KV for a custom redirect first
        //    (you'll populate this via `wrangler kv key put`)
        const customTarget = await env.CUSTOMLINKS.get(kvKey);
        if (customTarget) {
            return Response.redirect(customTarget, 302, {
                headers: {
                  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                  "Pragma": "no-cache",
                  "Expires": "0"
                }
            });
        }
        
        const firesim = parts[0].includes("firesim") || parts[0].includes("fsim") || parts[0].substring(0, 2) === "fs"
        const ghowner = firesim ? "firesim" : "ucb-bar"; // default org
        const repo = firesim ? (parts.length === 1 ? "firesim" : parts[1]) : (parts[0].substring(0, 2) === "cy" ? "chipyard" : parts[0]); // if firesim, shift args by 1, and if no arg after `ucb.bar/firesim` then resolve to firesim repo

        // remove firesim tag if present for next steps AND there are more parts than just `/firesim@hash` or `/firesim`
        if (firesim && parts.length > 1) { 
            parts = parts.slice(1) 
        } 
        console.log(`new parts: ${parts}`)
        
        // resolve folders in each repo -- if we have greater than 1 `/` args we're most likely we're trying to resolve a path
        if (parts.length > 1) {
            const path = parts.slice(1).join("/");
            console.log(`path resolving: ${path}`)
            const target = `https://github.com/${ghowner}/${repo}/tree/${commitSha || "master"}/${path}`;
            return Response.redirect(target, 302, {
                headers: {
                  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                  "Pragma": "no-cache",
                  "Expires": "0"
                }
            });
        }
         
        // /repo → redirect to GitHub repo root if all else fails
        const target = commitSha ? `https://github.com/${ghowner}/${repo}/tree/${commitSha}`: `https://github.com/${ghowner}/${repo}`;
        return Response.redirect(target, 302, {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
              "Pragma": "no-cache",
              "Expires": "0"
            }
        });
    },
};
