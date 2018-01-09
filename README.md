# [![Logo](icon128.png)Chrome-Web-Analyser](#Chrome-Web-Analyser)
> Chrome extension that hashes scripts on a page to detect when they are changed.
## [Contents](#Contents)
1. [Description](#Description)
2. [Usage](#Usage)
3. [Downloads](#Downloads)
4. [Licence](#Licence)

## [Description](#Description)
This is a web extension written originally for chrome (may be pushed to other platforms later), its aim is to detect when scripts are added, changed or removed on a web page. This can be useful if you are developing an extension that is dependent on scripts in the page or to detect a MITM attack. The extension creates a hash of every script on the page or saves the url if the script is blocked (adblock). It then compares to the save of the webpage next time you open the page, if the scripts have been modified you are notified via chrome's notification api.

## [Usage](#Usage)

## [Downloads](#Downloads)
- [x] [Chrome Webstore](https://chrome.google.com/webstore/detail/kbigjleekjpcbmcbinehcjccohjhohan/)
- [ ] Firefox Add-Ons Store
- [ ] Opera Add-Ons

## [Licence](#Licence)
