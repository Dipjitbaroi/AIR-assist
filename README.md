# AIRAssist PWA

AIRAssist is a Progressive Web App (PWA) that enables real-time voice interaction with your AI assistant "Alli" through a Bluetooth earpiece. The app captures audio from your earpiece, sends it to your n8n automation with Claude, and plays back the AI responses through your earpiece.

## Features

- Responsive design optimized for iOS/iPhone
- Bluetooth earpiece connectivity
- Voice capture and streaming
- Real-time audio response playback
- Offline functionality via PWA caching
- Mobile-first UI design

## Prerequisites

1. A server to host the PWA files
2. n8n instance running with Claude integration set up
3. A Bluetooth earpiece compatible with Web Bluetooth API
4. HTTPS secure connection (required for PWA and Web Bluetooth)

## Setup Instructions

### 1. Configure your n8n workflow

Your n8n workflow should be set up to:
- Receive audio input from the webhook endpoint
- Transcribe the audio to text
- Send the text to Claude for processing
- Convert Claude's text response to speech
- Return both the text and audio URL back to the AIRAssist app

Example n8n workflow structure:
1. Webhook node to receive audio
2. HTTP Request node to send audio for transcription
3. Function node to process the transcription
4. Claude node to generate a response
5. Text-to-Speech node to convert the response to audio
6. Function node to prepare the final response
7. Webhook Response node to send data back to AIRAssist

### 2. Update Configuration

In the `index.html` file, update the N8N_WEBHOOK_URL variable with your actual n8n webhook URL:

```javascript
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/ai-assistant';
```

### 3. Create App Icons

Create the following icon files and place them in an `/icons` directory:
- icon-192x192.png (192x192px)
- icon-512x512.png (512x512px)
- maskable-icon.png (512x512px with padding for adaptive icons)
- badge-icon.png (96x96px)

### 4. Hosting and Deployment

1. Set up a web server with HTTPS enabled (required for PWA and Web Bluetooth)
2. Upload all the files to your web server:
   - index.html
   - service-worker.js
   - manifest.json
   - /icons directory with all icons

3. Test the app by navigating to your website on an iOS device

### 5. Installing the PWA on iOS

To install AIRAssist as a PWA on iOS:
1. Open Safari and navigate to your web app URL
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Name your app and tap "Add"

The app will now appear on your iOS home screen as a standalone app.

## Technical Notes

### Web Bluetooth API Limitations

Web Bluetooth API has some limitations on iOS:
- Safari does not fully support Web Bluetooth API as of 2025
- Users may need to use a compatible browser like Chrome or Edge
- The API only works in secure contexts (HTTPS)
- Some advanced audio features may require workarounds

### Audio Streaming

The current implementation uses a simplified approach to audio streaming:
1. Captures audio from the device microphone
2. Sends the audio to n8n for processing
3. Receives audio response URLs and plays them through the device's audio output

For a production environment, you may need to implement:
- Direct Bluetooth audio streaming using specialized APIs or packages
- Better error handling and reconnection logic
- Compression for more efficient audio transmission

### Future Enhancements

Potential improvements to consider:
- Implement WebSockets for real-time bidirectional communication
- Add end-to-end encryption for enhanced security
- Improve UI/UX with more visual feedback
- Add user authentication
- Support for background operation
- Push notifications for messages
- Voice activity detection for automatic listening

## Troubleshooting

### Bluetooth Connection Issues

- Ensure your Bluetooth earpiece is in pairing mode
- Check that your browser supports Web Bluetooth API
- Verify your device is using HTTPS (required for Web Bluetooth)
- Try disconnecting and reconnecting the device
- See [BLUETOOTH_CONNECTIVITY_UPDATE.md](BLUETOOTH_CONNECTIVITY_UPDATE.md) for detailed information about recent improvements to Bluetooth connectivity
- **iOS Users**: See [iOS_BLUETOOTH_GUIDE.md](iOS_BLUETOOTH_GUIDE.md) for specific instructions to improve Bluetooth connectivity on iOS devices

### n8n Connection Issues

- Verify your n8n instance is running and accessible
- Check that your webhook URL is correct in the app configuration
- Ensure your n8n workflow is properly configured to handle the requests
- Check server logs for any error messages

### Audio Issues

- Allow microphone permissions when prompted
- Check that your Bluetooth earpiece is set as the default audio device
- Ensure your device's volume is turned up
- Try disconnecting and reconnecting your Bluetooth device

## License

This project is provided as-is without any warranties. You are free to modify and use it for your personal or commercial projects.
