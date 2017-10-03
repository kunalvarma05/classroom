# classroom

> A Virtual Classroom.

## Build Setup

``` bash
# install dependencies
npm install

# Clone the env file
# And update the contents
cp env.example.js env.js

# serve with hot reload at localhost:8080
npm run dev
```

## Production
```bash
# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Project Structure

##### index.html
This is the template `index.html` for our single page application (SPA). During development and builds, Webpack will generate assets, and the URLs for those generated assets will be automatically injected into this template to render the final HTML.

-------------

#### /config
This folder contains all the configuration files. The important files in this are: 
1. `dev.env.js`: This contains the development environment variables.
1. `prod.env.js`: This contains the production environment variables.

-------------

#### /src
The `/src` directory is where all the source files are present. It further has sub-directories each with it's own purpose:

##### main.js
This is the app entry file. This is where our Vue application is instantiated. Any Vue plugins (`router`, `vuex`, etc) can be registered here.

##### App.vue
The `App.vue` file is the main app component. All other pages will be rendered inside this.

##### /assets
This is where all the static assets, like images, are stored.

##### /pages
This directory contains all the components which act as pages or, to be specific, are used/rendered by the router. They can be further nested in sub-directories according to context. The filenames must be PascalCased. Eg: `Home`, `UserCard`.

##### /components
This directory contains all the Components used throughout the application. They can be further nested in sub-directories according to context. The filenames must be PascalCased. Eg: `Navbar`, `UserCard`.

##### /router
This directory contains a single file, `index.js`, for now. This file contains all the `route` <-> `page` mappings.

##### /stylus
This directory contains all the style files, in Stylus format. All the sub-directories, inside this directory, must have files prefixed or starting with an `_` (underscores). For example: `/stylus/variables/_colors.styl`. 

All the sub-directories should have an `all.styl` file, which combines (imports) all the other files (that start with an `_` underscores). Further, this `all.styl` file should be imported inside the `/stylus/app.styl` file. 

Any file, that are to be imported directly outside of the `/stylus` folder, must be kept in the root of the `/stylus` folder. For example, the `/stylus/app.styl` file imports the `/stylus/variables/all.styl` and the `/stylus/app/all.styl` files, and then it is imported directly in the `/src/App.vue` file. Thus, the `/stylus/app.styl` file acts as single source of all the styling, from outside of the `/stylus` folder.  

-------------

#### /static
This directory contains purely static assets, which are to be used directly. It acts as an escape hatch for static assets that you do not want to process with Webpack. They will be directly copied into the same directory where webpack-built assets are generated which, in this case, is the `/dist` directory.

-------------

#### /build
This directory holds the actual configurations for both the development server and the production webpack build. Normally you don't need to touch these files unless you want to customize Webpack loaders, in which case you should probably look at `build/webpack.base.conf.js`.

-------------

## Libraries Used
- Vue
- Vue-Router
- Vuetify
