To install, build, and test:

## Install Packages

`pnpm install`

## Build Packages

`pnpm build:all`

## Test Packages

### Firefox

Enter `about:debugging` into the URL bar in Firefox, hit Enter, and click on `This Firefox` in the left panel.

Click `Load Temporary Add-on...`

Navigate to `dist/firefox` and open the `manifest.json`.

This will load the extension into Firefox for testing.

### Chrome

Enter `chrome://extensions/` in the URL bar in Chrome, hit Enter.

Turn on `Developer Mode` in the top-right.

Click `Load unpacked` button.

Navigate to `dist/chrome` and open the `manifest.json`.

This will load the extension into Chrome for testing.



