# Elaview Mobile Commands

## Development

```bash
pnpm dev              # Start Expo dev server
pnpm start            # Alias for dev
pnpm android          # Run on Android emulator/device
pnpm ios              # Run on iOS simulator/device
pnpm web              # Run on web browser
```

## Type Checking & Linting

```bash
pnpm typecheck        # Run TypeScript compiler (tsc --noEmit)
pnpm lint             # Run ESLint on src/
```

## Building

```bash
pnpm prebuild         # Generate native code (iOS/Android)
```

## Useful Expo Commands

```bash
# Development
npx expo start --clear           # Start with cache cleared
npx expo start --dev-client      # Start with dev client
npx expo install --fix           # Fix dependency version mismatches

# Native builds
npx expo run:ios                 # Build & run on iOS simulator
npx expo run:android             # Build & run on Android emulator

# Production builds (requires EAS account)
npx expo build:ios               # Build for iOS
npx expo build:android           # Build for Android

# Diagnostics
npx expo doctor                  # Check for common issues
npx expo whoami                  # Show current Expo account
```

## Troubleshooting

```bash
# Clear all caches
npx expo start --clear
watchman watch-del-all           # Clear watchman cache (macOS)
rm -rf node_modules              # Nuclear option
pnpm install

# Reset iOS simulator
xcrun simctl erase all

# Reset Metro bundler
npx react-native start --reset-cache
```

## Common Workflows

### First time setup
```bash
pnpm install
npx expo prebuild
pnpm ios  # or pnpm android
```

### Daily development
```bash
pnpm dev
# Press 'i' for iOS, 'a' for Android, 'w' for web
```

### Before committing
```bash
pnpm typecheck
pnpm lint
```