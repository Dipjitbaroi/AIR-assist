# AIRAssist Maintenance Guide

This guide provides instructions for maintaining both the PWA and Capacitor versions of the AIRAssist app.

## Project Structure

The AIRAssist project is now set up with the following structure:

- **PWA Version**: The original Progressive Web App that Android users will continue to use.
- **Capacitor Version**: A wrapped version of the PWA for iOS users, distributed through TestFlight.

## Making Updates

When you need to make updates to the app, follow these steps to ensure both versions stay in sync:

### 1. Update the Web Assets

All changes to the app's functionality should be made to the web assets first:

1. Modify the HTML, CSS, and JavaScript files as needed
2. Test the changes in a web browser
3. Make sure the PWA works correctly

### 2. Update the Capacitor Project

After updating the web assets, update the Capacitor project:

```bash
# Copy web assets to the iOS project
npx cap copy ios

# Update any plugin changes
npx cap update ios
```

### 3. Test Both Versions

- **PWA Version**: Test in Chrome or another browser that supports Web Bluetooth API
- **Capacitor Version**: If you have a Mac with Xcode, open the project and test on a simulator or device:
  ```bash
  npx cap open ios
  ```

### 4. Deploy Updates

#### PWA Deployment

1. Upload the updated web assets to your web server
2. Users will get the updates the next time they visit the site or refresh the app

#### Capacitor/TestFlight Deployment

1. Follow the steps in the [TestFlight Guide](TESTFLIGHT_GUIDE.md) to build and upload a new version
2. Remember to increment the build number in Xcode before uploading
3. TestFlight users will receive a notification about the update

## Adding New Features

### Web Bluetooth API Features (PWA)

When adding features that use the Web Bluetooth API:

1. Implement the feature using the Web Bluetooth API
2. Test thoroughly in Chrome or other supporting browsers
3. Add appropriate fallbacks or error messages for unsupported browsers

### Native Bluetooth Features (Capacitor)

When adding features that use native Bluetooth capabilities:

1. Use the Capacitor Bluetooth LE plugin in your code
2. Implement feature detection to use the appropriate API:
   ```javascript
   if (window.Capacitor && window.Capacitor.isNativePlatform()) {
     // Use Capacitor Bluetooth LE plugin
   } else if (navigator.bluetooth) {
     // Use Web Bluetooth API
   } else {
     // Show error or fallback
   }
   ```

## Managing Dependencies

### PWA Dependencies

- Keep track of any external libraries or dependencies used in the PWA
- Update them regularly for security and performance improvements

### Capacitor Dependencies

- Update Capacitor and its plugins regularly:
  ```bash
  npm update @capacitor/core @capacitor/cli @capacitor/ios
  npm update @capacitor-community/bluetooth-le
  npx cap update ios
  ```

## Troubleshooting

### PWA Issues

- Check browser console for errors
- Verify that the service worker is registered correctly
- Test in different browsers to identify browser-specific issues

### Capacitor Issues

- Check Xcode console for errors when testing on iOS
- Verify that plugins are correctly installed and configured
- Check that the web assets have been properly copied to the iOS project

## Version Control

- Keep track of versions for both the PWA and Capacitor app
- Use semantic versioning (MAJOR.MINOR.PATCH) for the app version
- Increment the build number for each TestFlight submission

## Backup Strategy

- Regularly backup your project files
- Consider using a version control system like Git
- Keep archives of successful builds

## Documentation

- Update documentation when making significant changes
- Document any workarounds or special considerations for different platforms
- Keep a changelog to track changes between versions
