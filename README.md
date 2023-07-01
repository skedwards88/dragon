# Dragon Hero

You wake up to the sounds of screaming and the smell of burning wood. What do you do next?

A text adventure puzzle game.

**Players:** 1

**Time:** 20 minutes

[Play Now!](https://skedwards88.github.io/dragon/)

![Game icon](src/images/icon_192.png)

Do you have feedback or ideas for improvement? [Open an issue](https://github.com/skedwards88/dragon/issues/new).

Want more games? Visit [SECT Games](https://skedwards88.github.io/).

## Development

To build, run `npm run build`.

To update a background image, update the file in `src/images/background_images_raw`. During deployment, the prebuild script will compress the images into the webp format found in `src/images/background_images`. You can also compress these images by running `npm run compressImages` if you have the [webp compression tool](https://developers.google.com/speed/webp/docs/precompiled) installed.

To run locally with live reloading and no service worker, run `npm run dev`. (If a service worker was previously registered, you can unregister it in chrome developer tools: `Application` > `Service workers` > `Unregister`.)

To run locally and register the service worker, run `npm start`.

To deploy, push to `main` or manually trigger the `.github/workflows/deploy.yml` workflow.

Since this app doesn't have a custom domain, asset links for the Google Play Store are stored at https://github.com/skedwards88/.well-known (https://skedwards88.github.io/.well-known/assetlinks.json).
