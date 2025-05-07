# AIRAssist TestFlight Distribution Guide

This guide provides step-by-step instructions for distributing the AIRAssist app through TestFlight for iOS users.

## Prerequisites

1. An Apple Developer account ($99/year)
2. Xcode installed on a Mac computer
3. An iOS device for testing (optional, but recommended)

## Building and Distributing the App

### 1. Set Up App Store Connect

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/)
2. Go to "My Apps" and click the "+" button to create a new app
3. Fill in the required information:
   - Platform: iOS
   - App Name: AIRAssist
   - Primary Language: English
   - Bundle ID: io.airassist.app (or your custom bundle ID)
   - SKU: airassist (or any unique identifier)
   - User Access: Full Access

### 2. Open the Project in Xcode

1. Connect your Mac to your development machine
2. Copy the entire project folder to your Mac
3. Open Xcode on your Mac
4. Open the iOS project by selecting `ios/App/App.xcworkspace` (not the .xcodeproj file)

### 3. Configure Signing and Capabilities

1. In Xcode, select the "App" project in the Project Navigator
2. Select the "App" target
3. Go to the "Signing & Capabilities" tab
4. Sign in with your Apple Developer account
5. Select your Team
6. Ensure "Automatically manage signing" is checked
7. Xcode will generate a provisioning profile for you

### 4. Configure App Settings

1. Update the Bundle Identifier if needed (should match what you entered in App Store Connect)
2. Set the Version and Build numbers
   - Version: 1.0.0 (semantic versioning)
   - Build: 1 (increment this for each TestFlight submission)

### 5. Add Required Capabilities

1. Still in the "Signing & Capabilities" tab, click "+ Capability"
2. Add the following capabilities:
   - Background Modes
     - Check "Uses Bluetooth LE accessories"
     - Check "Audio, AirPlay, and Picture in Picture"
   - Access WiFi Information (if needed)

### 6. Build the App for Distribution

1. Select the target device as "Any iOS Device (arm64)"
2. From the menu, select Product > Archive
3. Wait for the build to complete and the Archives window to appear

### 7. Upload to TestFlight

1. In the Archives window, select your new archive
2. Click "Distribute App"
3. Select "App Store Connect" and click "Next"
4. Select "Upload" and click "Next"
5. Select distribution options:
   - Include bitcode: Yes
   - Upload symbols: Yes
6. Select your distribution certificate and provisioning profile
7. Review the information and click "Upload"
8. Wait for the upload to complete and processing to finish

### 8. Configure TestFlight

1. Return to [App Store Connect](https://appstoreconnect.apple.com/)
2. Go to "My Apps" and select your app
3. Click on the "TestFlight" tab
4. Wait for the build to finish processing (can take up to an hour)
5. Once processed, toggle the "TestFlight" switch to enable testing

### 9. Add Testers

#### Internal Testers
1. In the TestFlight tab, select "Internal Testing"
2. Click "+" to add internal testers (limited to users in your development team)
3. Select team members and click "Add"

#### External Testers
1. In the TestFlight tab, select "External Testing"
2. Click "+" to create a new group or use the default "External Testers" group
3. Click "Add Testers" and enter email addresses
4. Click "Next" and select the build to test
5. Add a description of what to test
6. Click "Send Invites"

### 10. Tester Instructions

Provide these instructions to your testers:

1. Install the TestFlight app from the App Store
2. Open the invitation email on their iOS device
3. Tap the "View in TestFlight" or "Start Testing" button
4. Install the AIRAssist app through TestFlight
5. Launch the app and grant necessary permissions

## Updating the App

When you make changes to the app:

1. Update the web assets in the `www` directory
2. Run `npx cap copy ios` to copy the updated web assets to the iOS project
3. Run `npx cap update ios` to update any plugin changes
4. Open the project in Xcode: `npx cap open ios` (if you're on a Mac)
5. Increment the Build number
6. Archive and upload the new build following steps 6-7 above
7. The new build will be available to testers once it's processed

## Troubleshooting

### Common Issues

1. **Signing Issues**: Ensure your Apple Developer account is active and you've selected the correct team in Xcode.

2. **Upload Failures**: Check your internet connection and try again. If the problem persists, try generating a new archive.

3. **TestFlight Processing Issues**: Sometimes processing can take longer than expected. If a build is stuck in processing for more than a few hours, try uploading a new build.

4. **Missing Permissions**: Ensure all required permissions are properly configured in the Info.plist file.

5. **Bluetooth Issues**: Make sure the Bluetooth capabilities are properly configured and the necessary permission strings are in Info.plist.

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Apple Developer Forums](https://developer.apple.com/forums/)
2. Review the [TestFlight documentation](https://developer.apple.com/testflight/)
3. Contact Apple Developer Support through your developer account

## Notes for Android Users

This TestFlight distribution does not affect Android users. They will continue to use the PWA version of AIRAssist as before.
