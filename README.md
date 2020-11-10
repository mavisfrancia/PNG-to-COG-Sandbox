# PNG-to-COG-Sandbox

## create_and_validate_cog.js

Note: Do NOT have a Finder window open for this directory when running scripts. The processes will not be able to successfully write the output files.

1. Build rio-cogeo Docker image before running commands to build COG;
    1. `cd` into `rio-cogeo`
    2. Run `docker build -t rio-cogeo:latest .`

2. Run `node create_and_validate_cog.js` to log out which commands to run for the conversion process.
3. Run each command in turn.
