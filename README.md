# screenshot_codebase
Want a screenshot of a codebase?  Want to compare the size of two codebases visually?  Here ya go.

## Installation
`npm install -g screenshot_codebase`

If you don't have `npm`, [install `node`](https://nodejs.org/en/download/) to get it.

## Basic Usage

  * `screenshot_codebase`
    * Creates `output.png` with a screenshot of the current directory, travelling downwards, 
      with standard excludes, the default `midnight` theme, and automatic highlighting turned on.
  * ~~`screenshot_codebase -h off -c midnight -o final.png`~~
    * ~~Creates `final.png` with highlighting turned off, in the `midnight` theme~~
    
## Arguments
  * ~~`-f` font~~
  * ~~`-s` font size (default 4px)~~
  * ~~`-c` color theme~~
  * ~~`-h` auto|off|~~
  * ~~`-x` exclude comma-separated list of extensions~~
  * ~~`-t` type override comma-separated list of key/val pairs for ext = lang (eg for perl vs prolog as .pl)~~
  * ~~`-l` location to start from~~
