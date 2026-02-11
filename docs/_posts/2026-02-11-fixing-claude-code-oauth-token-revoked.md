---
draft: false
published: true
title: "Fixing Claude Code OAuth token revoked when switching accounts"
date: '2026-02-11T18:00:00.000Z'
categories: [engineering]
keywords: [claude-code, oauth, debugging, anthropic, cli]
slug: /fixing-claude-code-oauth-token-revoked
type: note
---

Claude Code caches OAuth tokens in at least four places: environment variables, macOS Keychain, dotfiles, and XDG config directories. When you switch from one Anthropic account to another — say, moving to a different Max plan email — the old token stays cached and you get a "token revoked" error on every launch. The CLI never prompts you to re-authenticate because it thinks it already has a valid token.

The fix is a full credential purge. Here's every location you need to hit:

**1. Remove hardcoded tokens from your shell config**

```bash
sed -i '' '/CLAUDE_CODE_OAUTH_TOKEN/d' ~/.zshrc
```

If you exported the token directly in `.zshrc` or `.bashrc` at any point, that stale value loads before Claude Code even starts. Delete the line.

**2. Unset lingering env vars in the current session**

```bash
unset CLAUDE_CODE_OAUTH_TOKEN
unset ANTHROPIC_API_KEY
source ~/.zshrc
```

The shell session still holds the old value in memory even after editing the file.

**3. Clear macOS Keychain**

```bash
security delete-generic-password -s "Claude Code" 2>/dev/null
```

Claude Code stores credentials in the system keychain. This survives shell restarts and even npm updates.

**4. Delete all cached credential directories**

```bash
rm -rf ~/.claude
rm -f ~/.claude.json
rm -rf ~/.config/claude-code/
rm -rf ~/.config/@anthropic-ai/
```

Four separate locations. Miss one and the stale token comes back.

**5. Restart terminal completely**

Close the terminal app entirely and reopen. `source ~/.zshrc` is not enough — some env vars get inherited from the parent process.

**6. Update Claude Code**

```bash
npm update -g @anthropic-ai/claude-code
```

**7. Login fresh**

```bash
claude
```

When the OAuth page opens, use an incognito browser window. This prevents your browser's cached Google/Anthropic session from auto-selecting the wrong account. Pick the correct Max plan email explicitly.

---

The root cause: OAuth token caching is distributed across shell config, OS keychain, and multiple XDG directories. There's no single `claude logout` that clears all of them. When switching accounts, you need to scorched-earth the credential layer and start clean.
