# Dragon Hero

You wake up to the sounds of screaming and the smell of burning wood. What do you do next?

A text adventure puzzle game.

**Players:** 1

**Time:** 20 minutes

[Play Now!](https://skedwards88.github.io/dragon/)

![Game icon](src/images/favicon.png)

Do you have feedback or ideas for improvement? [Open an issue](https://github.com/skedwards88/dragon/issues/new).

Want more games? Visit [CnS Games](https://skedwards88.github.io/portfolio/).

## Development

To build, run `npm run build`.

To run locally with live reloading and no service worker, run `npm run dev`. (If a service worker was previously registered, you can unregister it in chrome developer tools: `Application` > `Service workers` > `Unregister`.)

To run locally and register the service worker, run `npm start`.

When running locally, you may get an `opensslErrorStack: [ 'error:03000086:digital envelope outines::initialization error' ],` error. Executing `export NODE_OPTIONS=--openssl-legacy-provider` can resolve this.

To deploy, push to `main` or manually trigger the `.github/workflows/deploy.yml` workflow.
