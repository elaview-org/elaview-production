# Repository Commands Guide

## Code Statistics

```bash
ev repo:loc                     # Source code only (excludes docs, config, node_modules)
ev repo:loc:all                 # All files including docs
ev repo:loc -- --by-file        # Breakdown by file
ev repo:loc -- -f json          # JSON output
```

## Repository Overview

```bash
ev repo:info                    # Summary with ASCII art, languages, contributors
ev repo:size                    # Analyze bloat, large files, history issues
ev repo:size -- -v              # Verbose output
```

## Contributor Analysis

```bash
ev repo:contributors            # LOC by author (can be slow on large repos)
ev repo:contributors -- -e      # Exclude files matching pattern
ev repo:activity                # Interactive menu: commits by day/week/author
```

## Language Breakdown

```bash
ev repo:languages               # GitHub-accurate language percentages
ev repo:languages -- --breakdown # Show files per language
```

## Secret Scanning

```bash
ev repo:secrets                 # Quick scan of working directory
ev repo:secrets:history         # Scan full git history
ev repo:secrets:deep            # Deep scan with verification (slower, fewer false positives)
ev repo:secrets -- --verbose    # Show what's being scanned
```

## Interactive UI

```bash
ev repo:ui                      # Launch lazygit TUI
```

## Common Workflows

**Pre-commit check:**
```bash
ev repo:secrets && ev repo:loc
```

**Project health overview:**
```bash
ev repo:info && ev repo:size
```

**Before PR review:**
```bash
ev repo:secrets:history         # Ensure no secrets in commits
```