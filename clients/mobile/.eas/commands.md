submit ios to app store

// submit-ios workflow does this
eas submit --platform ios
eas workflow:run submit-ios.yml

// publish update workflow does this
eas update --auto
eas workflow:run publish-update.yml

npx expo start --dev-client --clear (clears cache)
