/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  const singleRequire = name => {
    if (name !== 'require') {
      name = name + '.js';
    }
    let promise = Promise.resolve();
    if (!registry[name]) {
      
        promise = new Promise(async resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = name;
            document.head.appendChild(script);
            script.onload = resolve;
          } else {
            importScripts(name);
            resolve();
          }
        });
      
    }
    return promise.then(() => {
      if (!registry[name]) {
        throw new Error(`Module ${name} didn’t register its module`);
      }
      return registry[name];
    });
  };

  const require = (names, resolve) => {
    Promise.all(names.map(singleRequire))
      .then(modules => resolve(modules.length === 1 ? modules[0] : modules));
  };
  
  const registry = {
    require: Promise.resolve(require)
  };

  self.define = (moduleName, depsNames, factory) => {
    if (registry[moduleName]) {
      // Module is already loading or loaded.
      return;
    }
    registry[moduleName] = Promise.resolve().then(() => {
      let exports = {};
      const module = {
        uri: location.origin + moduleName.slice(1)
      };
      return Promise.all(
        depsNames.map(depName => {
          switch(depName) {
            case "exports":
              return exports;
            case "module":
              return module;
            default:
              return singleRequire(depName);
          }
        })
      ).then(deps => {
        const facValue = factory(...deps);
        if(!exports.default) {
          exports.default = facValue;
        }
        return exports;
      });
    });
  };
}
define("./service-worker.js",['./workbox-718aa5be'], (function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "03fa52ae215ae2852bb6.svg",
    "revision": null
  }, {
    "url": "18f4fc9f6b7bdd1ea2f7.svg",
    "revision": null
  }, {
    "url": "1d554ae2eb781ff30671.svg",
    "revision": null
  }, {
    "url": "2c32bfaa99e14a0f71ce.svg",
    "revision": null
  }, {
    "url": "2e85c66012af582e33a3.svg",
    "revision": null
  }, {
    "url": "33f6604304123530162c.svg",
    "revision": null
  }, {
    "url": "39dd1cf63f7038951e9c.svg",
    "revision": null
  }, {
    "url": "43904a0a58b33489991b.svg",
    "revision": null
  }, {
    "url": "6788115caef0531cf000.svg",
    "revision": null
  }, {
    "url": "67c1842907cfffdbafb6.svg",
    "revision": null
  }, {
    "url": "6d05a167a2a278efc587.svg",
    "revision": null
  }, {
    "url": "9b5a43c3cc56c2a382d7.svg",
    "revision": null
  }, {
    "url": "add711205b7469041384.svg",
    "revision": null
  }, {
    "url": "assets/android-chrome-144x144.png",
    "revision": "fb16bd8c29636d7019a2326b07e5d3d2"
  }, {
    "url": "assets/android-chrome-192x192.png",
    "revision": "d19c2fb98e861e9821bfdcb302a09aa2"
  }, {
    "url": "assets/android-chrome-256x256.png",
    "revision": "1a3d8c7097e436e73e293a81df72c6ed"
  }, {
    "url": "assets/android-chrome-36x36.png",
    "revision": "63f1807e0d08a141de2b30dcf2a8c220"
  }, {
    "url": "assets/android-chrome-384x384.png",
    "revision": "ea23b342b5337c96d64c39031994b9f5"
  }, {
    "url": "assets/android-chrome-48x48.png",
    "revision": "0d542687212d3924df736560d58abfa2"
  }, {
    "url": "assets/android-chrome-512x512.png",
    "revision": "647f09a2413c0d5224d13b609db5be41"
  }, {
    "url": "assets/android-chrome-72x72.png",
    "revision": "2a51f32712d95d3e76a2e54163c86f51"
  }, {
    "url": "assets/android-chrome-96x96.png",
    "revision": "830c2803887fbe0e46ee181fdacf12d9"
  }, {
    "url": "assets/apple-touch-icon-1024x1024.png",
    "revision": "81c428f26ce406d15cc7e212ee592c5f"
  }, {
    "url": "assets/apple-touch-icon-114x114.png",
    "revision": "27d39f4d930fdf608d4c1d6221a0e361"
  }, {
    "url": "assets/apple-touch-icon-120x120.png",
    "revision": "d23d686232a68b2024661d0df396a692"
  }, {
    "url": "assets/apple-touch-icon-144x144.png",
    "revision": "0b9d4aca22c85f83f7fa2c273805df9f"
  }, {
    "url": "assets/apple-touch-icon-152x152.png",
    "revision": "a5f5210870df88aa9a9aacae18d54a53"
  }, {
    "url": "assets/apple-touch-icon-167x167.png",
    "revision": "55d55172e6744a8ac7c37127c98f7dbd"
  }, {
    "url": "assets/apple-touch-icon-180x180.png",
    "revision": "689caac814b106b07ddb017b26b7be22"
  }, {
    "url": "assets/apple-touch-icon-57x57.png",
    "revision": "a6c965441372a1cca3c121b08b8e5da8"
  }, {
    "url": "assets/apple-touch-icon-60x60.png",
    "revision": "465dac64162dc76dd3401a9434ac4a77"
  }, {
    "url": "assets/apple-touch-icon-72x72.png",
    "revision": "84f0068a6686b3a21788bd9f5a9564fa"
  }, {
    "url": "assets/apple-touch-icon-76x76.png",
    "revision": "4cc9c0fb0e270d42c41df1500633ee5e"
  }, {
    "url": "assets/apple-touch-icon-precomposed.png",
    "revision": "689caac814b106b07ddb017b26b7be22"
  }, {
    "url": "assets/apple-touch-icon.png",
    "revision": "689caac814b106b07ddb017b26b7be22"
  }, {
    "url": "assets/apple-touch-startup-image-1125x2436.png",
    "revision": "c867632efbfa0aa17393718dc179780e"
  }, {
    "url": "assets/apple-touch-startup-image-1136x640.png",
    "revision": "63c4bc614871d54f9c5f0e64560b5e53"
  }, {
    "url": "assets/apple-touch-startup-image-1242x2208.png",
    "revision": "eae825298d2f01a157676d3aaa1c869d"
  }, {
    "url": "assets/apple-touch-startup-image-1242x2688.png",
    "revision": "6c05c1b83123ee26b021cdcaa74754dc"
  }, {
    "url": "assets/apple-touch-startup-image-1334x750.png",
    "revision": "4e7af21836da55e262e3e2456dd34547"
  }, {
    "url": "assets/apple-touch-startup-image-1536x2048.png",
    "revision": "a4c449967b46a039058bf4c5e371d156"
  }, {
    "url": "assets/apple-touch-startup-image-1620x2160.png",
    "revision": "4c270b5ca7deb5b8911822d0f9f78734"
  }, {
    "url": "assets/apple-touch-startup-image-1668x2224.png",
    "revision": "84acb2b56db01288733a8408630eb028"
  }, {
    "url": "assets/apple-touch-startup-image-1668x2388.png",
    "revision": "66cf506e2b79fd3563c8491cef0c0c8c"
  }, {
    "url": "assets/apple-touch-startup-image-1792x828.png",
    "revision": "d54618fda43e341a48ab3174d49e1a24"
  }, {
    "url": "assets/apple-touch-startup-image-2048x1536.png",
    "revision": "6af2582ca6619873f8ef852e2fb541fb"
  }, {
    "url": "assets/apple-touch-startup-image-2048x2732.png",
    "revision": "ef644fdd25c2d75d4b43920fa0e303ad"
  }, {
    "url": "assets/apple-touch-startup-image-2160x1620.png",
    "revision": "724447b9c4213df64162d654b6ec79e6"
  }, {
    "url": "assets/apple-touch-startup-image-2208x1242.png",
    "revision": "e64f578b6492349cfaaf47017e16e153"
  }, {
    "url": "assets/apple-touch-startup-image-2224x1668.png",
    "revision": "91b2d5df4721c26d4c1cdbc8b3792054"
  }, {
    "url": "assets/apple-touch-startup-image-2388x1668.png",
    "revision": "527031f87dd946f3c5e3d47fe9b7342d"
  }, {
    "url": "assets/apple-touch-startup-image-2436x1125.png",
    "revision": "ea6773cf438e72081a5a77159491c9d5"
  }, {
    "url": "assets/apple-touch-startup-image-2688x1242.png",
    "revision": "adde6a2531c7883778fd0c92434233b0"
  }, {
    "url": "assets/apple-touch-startup-image-2732x2048.png",
    "revision": "1bcce658b91aa484ad25103ef1fc6e2e"
  }, {
    "url": "assets/apple-touch-startup-image-640x1136.png",
    "revision": "2b3836cf0be812cab8955f5bb7165e0e"
  }, {
    "url": "assets/apple-touch-startup-image-750x1334.png",
    "revision": "e1fd76b8235e0eac996d35b5e2141b30"
  }, {
    "url": "assets/apple-touch-startup-image-828x1792.png",
    "revision": "3ac5ffa983091521a91546e5ddaa1e68"
  }, {
    "url": "assets/browserconfig.xml",
    "revision": "aacc0cdb9901cf7feeedeab44b3e2d14"
  }, {
    "url": "assets/favicon-16x16.png",
    "revision": "bfb630a59d4f0bd6c7fb35213ff42559"
  }, {
    "url": "assets/favicon-32x32.png",
    "revision": "499f056136b3267f789a00dd7c1cceda"
  }, {
    "url": "assets/favicon-48x48.png",
    "revision": "0d542687212d3924df736560d58abfa2"
  }, {
    "url": "assets/favicon.ico",
    "revision": "2b1bf777d9d6e9797a2f62a4e002d3aa"
  }, {
    "url": "assets/firefox_app_128x128.png",
    "revision": "f78f528be07ff57ae43d3f153a4f095a"
  }, {
    "url": "assets/firefox_app_512x512.png",
    "revision": "d71de23027221481fc99374e6f778f25"
  }, {
    "url": "assets/firefox_app_60x60.png",
    "revision": "6b4399ec044dbc00718f1df885301d11"
  }, {
    "url": "assets/manifest.json",
    "revision": "04f7774a03a642daa4f002a2989c705c"
  }, {
    "url": "assets/manifest.webapp",
    "revision": "00df1b24218a044dfdfdc559b574397e"
  }, {
    "url": "assets/mstile-144x144.png",
    "revision": "fb16bd8c29636d7019a2326b07e5d3d2"
  }, {
    "url": "assets/mstile-150x150.png",
    "revision": "60b96bca02e253ecdb1ac6aedabf5c7a"
  }, {
    "url": "assets/mstile-310x150.png",
    "revision": "e9d9018d8fe28f77b100cdb9e900dca6"
  }, {
    "url": "assets/mstile-310x310.png",
    "revision": "224fcf97891e7c921318bca0579c946d"
  }, {
    "url": "assets/mstile-70x70.png",
    "revision": "20775fb0c0e64cb7eb59e7b233242d14"
  }, {
    "url": "bundle.js",
    "revision": "6426d6940d65c1aacf8a8a836b03b387"
  }, {
    "url": "d0c1e575e7452f03948e.svg",
    "revision": null
  }, {
    "url": "d525c3082f3f15f5a355.svg",
    "revision": null
  }, {
    "url": "d58864649516fab15781.svg",
    "revision": null
  }, {
    "url": "f6a65b6b3b51febc2cee.svg",
    "revision": null
  }, {
    "url": "fc1d2da213187739c04d.svg",
    "revision": null
  }, {
    "url": "index.html",
    "revision": "0c68ba0d7e6eeb1061b325413ec1bd02"
  }], {});

}));
