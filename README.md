# Message Lab Theme
## What is this?
This is a custom theme for the Digital Transformation Agency's internal Message Lab Drupal 8 site. It is a sub-theme of Classy and incorporates elements of the DTA's [UI Kit](https://github.com/govau/uikit).

## What does this theme contain?
Message Lab Theme is a Drupal 8 front-end theme. It provides template overrides and preprocess functions to enable theme hook suggestions. It also adds appropriate selectors to apply the UI Kit.

## Adding the theme to your project
We recommend adding the site to a Drupal 8 project using Composer. It can also be done manually.

### Using Composer
First, run `$ composer -v` to check Composer is installed. If it isn't, follow these steps:
1. (For Macs) Run `$ brew -v` to check Homebrew is installed. If it isn't, install using the instructions on the [Homebrew site](https://brew.sh/).
2. Install Composer:
  * `$ brew update`
  * `$ brew tap homebrew/dupes`
  * `$ brew tap homebrew/php`
  * `$ brew install php56` or `$ brew install php71` for PHP7.
  * `$ brew install composer`
3. Test the installation with `$ composer -v`.
4. Add the package to `composer.json` file by adding this object to the `"repositories"` object, before the existing `"packagist"` object. This will allow Composer to use the Git repository as a package source.
```json
    "message_theme": {
      "type": "package",
      "package": {
        "name": "govau/message-lab-theme",
        "type": "drupal-custom-theme",
        "version": "dev-master",
        "source": {
          "type": "git",
          "url": "https://github.com/govau/message-lab-theme",
          "reference": "master"
        }
      }
    }
```
5. Run `$ composer require govau/message-lab-theme:dev-master` to add the package to the list of dependencies.
6. Run `$ composer update` to install the package and update the `composer.lock` file.
7. Enable the theme using Drush or the Drupal UI.
8. Clear caches.

Please see [drupal.org](https://www.drupal.org/docs/develop/using-composer) for further information on using Composer to manage Drupal. if you are currently using Drush Make to manage your dependencies, please consider the benefits of switching to Composer.

### Manually
While this seems the faster option, it won't allow proper tracking of dependencies or easier remote deployment.
1. Clone the repository into your `themes/custom/` folder.
2. Enable the theme using Drush or the Drupal UI.
3. Clear caches.

## Developing the theme
The theme uses gulp.js to create a local server, compile Sass into CSS, inject style changes, and watch for SCSS, JS and twig changes. Install dependencies using NPM (Node Package Manager) before working on the theme.

Generally, you will need a local server to develop sites on, though you can use the `--staging` or `--production` flags to run a local BrowserSync server proxying a remote server.

The gulp task will also automatically check if the dependencies are up-to-date. This pertains in particular to the @govau/* UI Kit packages, however it will check all of them. You will receive an error in gulp if anything is out of date. You can update the packages manually or you can use [npm-check -u](https://github.com/dylang/npm-check) to do it in a nice, friendly way. Please note that npm-check will pick up some missing packages within UI Kit. These can be ignored and are found in .npmcheckrc.

### About gulp

gulp is a tool for automating various aspects of a development workflow. To add a task, install the required plugin (if necessary), import it into gulpfile.js and write the script for the task using JavaScript or ES6. There is a huge amount of plugins available for gulp so if you need to automate something it is probably possible. Check the list of [gulp recipes](https://github.com/gulpjs/gulp/tree/master/docs/recipes) for more ideas.

### Caveats
For this to work properly, you must already have the Drupal 8 site you wish to proxy [set up for local development](https://www.chapterthree.com/blog/how-to-turn-off-drupal-8-caching) by turning off the [render cache](https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Render!theme.api.php/group/theme_render/8.2.x#sec_caching) and enabling [twig debugging mode](https://www.drupal.org/docs/8/theming/twig/debugging-twig-templates) (if you want). You will also need to install the [Link CSS module](https://www.drupal.org/project/link_css), as BrowserSync does not work with Drupal's `@import` CSS statements.

### Installation

1. Check that Node and NPM are installed using `$ node -v` and `$ npm -v`. The theme uses gulp 4.0, so you may need to update Node and/or NPM to install it. If these are not installed, please install using Homebrew or use the instructions on the [Node.js site](https://nodejs.org/en/).
2. Install gulp globally using `$ npm install gulp-cli -g`.
3. Run `$ npm install` in the theme folder to install the required dependencies.
4. Update the URLs in `config.yml` to reflect your environment. If you do not have a production or staging server set them to the development server which could be run using Acquia Dev Desktop, xAMP or other.
5. Run `$ gulp` to start the build process. This will do the following:
  1. Clean out anything in the `css` folder.
  2. Rebuild the css file(s) from the SCSS source files.
  3. Start a local server proxying the `development` site listed in the `config.yml` file.
  4. Begin watching changes to SCSS files in the `/sass/` folder, twig files in the `/templates/` folder and JavaScript in the `/js/` folder. Changes to SCSS files will be injected into the local proxy, and changes to javascript and twig files will trigger a browser reload.
6. There is no need to minify CSS and JavaScript because this will be done by Drupal. Run `$ gulp --production` to proxy the live site as configured in `config.yml` and to remove source maps. You can also run [Uncss](https://github.com/giakki/uncss) by uncommenting the relevant line in `gulpfile.js`. Note, this can cause problems when scripts add selectors to the HTML and may require some configuration.
