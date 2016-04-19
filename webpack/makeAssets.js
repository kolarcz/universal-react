const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

module.exports = (ENV) => {
  const isDEV = (ENV === 'development');
  return {
    debug: false,

    webpack_assets_file_path: './webpack/assets.json',

    assets: {
      styles: {
        extensions: ['css', 'scss'],
        parser: (module, options, log) => (
          isDEV
            ? WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log)
            : module.source
        ),
        path: (module, options, log) => (
          isDEV
            ? WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log)
            : module.name
        ),
        filter: (module, regex, options, log) => (
          isDEV
            ? WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log)
            : regex.test(module.name)
        )
      },
      fonts: {
        extensions: ['eot', 'ttf', 'woff', 'woff2'],
        parser: WebpackIsomorphicToolsPlugin.url_loader_parser
      },
      images: {
        extensions: ['ico', 'gif', 'jpg', 'jpeg', 'png', 'svg'],
        parser: WebpackIsomorphicToolsPlugin.url_loader_parser
      }
    }
  };
};
