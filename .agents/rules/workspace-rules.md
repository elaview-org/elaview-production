---
trigger: always_on
---

STRICTLY FOLLOW THESE FIRST BEFORE ANYTHING ELSE:
- it is a general file which will be applied to any project or tech stack, it is basically for general coding guidelines and not specific to any project or tech stack.so don't put any current project context in here but put in context.md in root of repo only.
- deep search repo and check environment before doing anything.
- maintain a CONTEXT.md at the root. Continually update this file whenever you make changes. This file is strictly for YOU (the AI IDE) to maintain your own context, so you always understand the project state, structure, and how work is being done.
- don't rely on docs alone, always verify against actual code.
- present options with pros/cons before making choices — let me decide.
- use the project's toolchain — never install tools directly.
- give me commands to run for anything interactive or environment-related.
- list all prerequisites upfront before suggesting commands.
- **Trust but verify:** NEVER blindly trust documentation, file names, or your own assumptions. Always run safe read commands (like reading package.json, checking file contents, or running --version) to confirm the actual architecture and dependencies before taking any action.

---

## REFERENCE SECTION (DO NOT EXECUTE)
*The following section is strictly for AI IDE context/reference. Do not attempt to run these commands without explicit user instruction.*

### Topic: Devbox + Doppler Setup
When setting up a new project with Devbox and Doppler, the standard process is:

**1. Initialize Devbox**
Run `devbox init` (Creates `devbox.json`).

**2. Add Tools**
Add necessary packages (e.g., `devbox add bun docker doppler`).

**3. Configure Doppler**
Login (`doppler login`) and link the project (`doppler setup --project <project-name> --config development`).

**4. Load Secrets Automatically**
Add the following `init_hook` to `devbox.json` to load Doppler secrets whenever the environment starts:
```json
"shell": {
  "init_hook": [
    "eval \"$(doppler secrets download --no-file --format env 2>/dev/null)\""
  ]
}
```

**5. Start Environment**
Run `devbox shell` to enter the environment with all tools and secrets loaded.

**Rule of Thumb: What runs INSIDE vs OUTSIDE `devbox shell`?**
This rule applies to any project using Devbox:
- **INSIDE the shell:** Any command that interacts with project source code, starts a dev server, installs project-level dependencies (like `bun install`, `npm install`, etc.), runs a database migration, or requires Doppler secrets.
- **OUTSIDE the shell:** Global system actions, such as interacting with Git (`git commit`, `git push`) or installing system-wide packages (`apt install`, `brew install`).

### Topic: GitHub CLI & Git Credential Setup
To correctly authenticate the local Git environment with GitHub using a personal access token (avoiding password prompts):

**1. Login to GitHub CLI**
Run `gh auth login`.
Select:
- GitHub.com
- HTTPS protocol
- Authenticate Git with your GitHub credentials? Yes
- Login with a web browser

**2. Configure Git Credential Helper**
Run `git config --global credential.helper gh`
This explicitly tells Git to use the GitHub CLI (`gh`) to resolve authentication when pushing/pulling via HTTPS.