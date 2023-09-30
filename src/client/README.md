# Front-end for XtVision

## Usage for dev/tests

```bash
npm install
npm run dev
```

## Usage for production

```bash
npm install
npm run build
```
Creates a `dist` folder with the compiled files. I haven't explored in depth the config it can handle, but it's a good start.

## Notes
I am using as a base structure my [sidebar template](https://srv-gitea.castel.fr/simonot/react-base-project-with-sidebar), just picking the Sidebar component it contains and adapting the structure.


#### Packages used
+ [React](https://react.dev)
+ [TypeScript](https://www.typescriptlang.org)
+ [Vite](https://vitejs.dev) : Fast build tool, great when used for a front-end only project (when doing front+back, NextJS seems to be a better choice)
+ [ESLint](https://eslint.org)
+ [SWC](https://swc.rs) : Rust-based TypeScript compiler, managed by Vite in our case
+ [Redux toolkit](https://redux-toolkit.js.org) : Redux wrapper to simplify its usage
+ [Redux Persist](https://github.com/rt2zz/redux-persist) : Persist Redux state in local storage
+ [React-Redux](https://react-redux.js.org) : React bindings for Redux
+ [Bootstrap](https://getbootstrap.com) : Style framework
+ [React-Bootstrap](https://react-bootstrap.netlify.app) : React components for Bootstrap
+ [React-Icons](https://react-icons.github.io/react-icons) : Icons for React
+ [React-Router-Dom](https://reactrouter.com/web/guides/quick-start) : Routing for React
+ [dayjs](https://day.js.org) : Date/time library
+ [SASS](https://sass-lang.com) : CSS preprocessor (used to override Bootstrap styles)
+ React-Country-Flag : Display emoji or SVG flags
+ [React-Grid-Layout](https://github.com/react-grid-layout/react-grid-layout) : Dashboard layout with drag'n'drop
+ [i18next](https://www.i18next.com) : Internationalization
+ i18next-http-backend : i18next backend to load translations from a server
+ [React-i18next](https://react.i18next.com) : React bindings for i18next