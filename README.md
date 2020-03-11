# Mojo Visualizer

## What is this?
It visualizes things. See the code here:
https://awong-dev.github.io/mojo-viewer/public/

## How do I install it?
  1. Install nvm to get node version manager (cause otherwise the world goes
     nuts)
  2. Ensure you have an lts node installed. `nvm install --lts; nvm use --lts`
  3. Clone this package.
  4. Install the development node modules `npm install -D`.  This should get you
     a webpack, babel, eslint, mocha, sass, react, material envrionment. Yay.
  5. Start the dev server with `npm run watch`
  6. Visit `http://localhost:8081/webpack-dev-server/`.  Note the trailing
     slash. If you just go to the root, the page will work as well, but the
     webpack-dev-server allows you to watch the browser window for compiler
     failure and status.
