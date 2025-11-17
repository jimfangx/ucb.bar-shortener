# ucb.bar link shortener
* a spiffy little link shortner for ucb bar related links

## usage
* `ucb.bar` → github.com/ucb-bar
### special links
* `ucb.bar/cy` → github.com/ucb-bar/chipyard
* `ucb.bar/{firesim, fsim, fs}` → github.com/firesim
* Can support custom links (checked first before all auto-resolving links). 
    * Ex: `ucb.bar/web` → https://bar.eecs.berkeley.edu/

### auto-resolving links
* `ucb.bar/<any repo name in ucb-bar or firesim org>` → `github.com/{ucb-bar, firesim}/<specified repo>`
    * Ex: `ucb.bar/hammer` → https://github.com/ucb-bar/hammer
    * Ex: `ucb.bar/firesim/firesim` → https://github.com/firesim/firesim
    * Ex: `ucb.bar/firesim/FireMarshal` → https://github.com/firesim/FireMarshal
* `ucb.bar/<any repo name in ucb-bar or firesim org>/<file path>` → `github.com/{ucb-bar, firesim}/<specified repo>/<file path>`
    * Ex: `ucb.bar/hammer/hammer/par/innovus/__init__.py` → https://github.com/ucb-bar/hammer/blob/master/hammer/par/innovus/\_\_init__.py
* `ucb.bar/<any repo name>/<file path>@<commit hash>` → that file or repo at specified commit
    * Ex: `ucb.bar/firesim@015f6139d9a108f506d17740c63c5387ce9d3afe` → https://github.com/firesim/firesim/tree/015f6139d9a108f506d17740c63c5387ce9d3afe
    * Ex: `ucb.bar/hammer/hammer/par/innovus/__init__.py@b18de4b0f06c426b2e8e8e1bc9e6f459962c50ea` → https://github.com/ucb-bar/hammer/blob/b18de4b0f06c426b2e8e8e1bc9e6f459962c50ea/hammer/par/innovus/\_\_init__.py

## exceptions
* Resolving a file path in FireSim cannot be done via `ucb.bar/firesim/docs` (for example) due to potential confusion between a directory/file name with a repo name.

## deployment
* cloudflare workers
* `npm run deploy`
* Autodeploy setup