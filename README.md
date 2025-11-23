# X Account Location Revealer

A Chrome extension that reveals the "Account based in" location for X (formerly Twitter) users directly on their profile header.

## Features

- **Automatic Detection**: Automatically detects when you visit a user profile.
- **Seamless Integration**: Injects a flag emoji representing the account's location right next to the user's name.
- **Live Updates**: Updates automatically as you navigate between different user profiles without needing to refresh.
- **Privacy Focused**: Runs entirely locally in your browser.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the directory containing this extension.

## How it Works

X displays the "Account based in" information on a separate `/about` page for each user. This extension:

1. Detects the current profile being viewed.
2. Fetches the user's `/about` page in the background using a hidden iframe.
3. Uses `declarativeNetRequest` rules to bypass `X-Frame-Options` restrictions, allowing the iframe to load successfully.
4. Parses the location data from the iframe and maps it to a corresponding flag emoji.
5. Injects the emoji into the profile header DOM next to the username.

## Permissions

- `declarativeNetRequest`: Required to strip headers (`X-Frame-Options`) that would otherwise block the background data fetch.
- `Host Permissions`: Needed for `x.com` and `twitter.com` to run the content script and apply network rules.
