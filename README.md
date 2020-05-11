# webpack-inject-chunk-filename-plugin

Webpack Plugin that injects chunks filename to outputs or any files you define.

## Install

`npm i webpack-inject-chunk-filename-plugin -D`

## Usage

### Inject chunks to another chunk

Inject chunks filename to outputs. you should make sure each chunks have name, so that the plugin can find it.

Suppose you have two chunks, `app` and `lib`. You want to inject chunk `lib`'s output filename to chunk `app`'s output source.

- Add a placeholder such as `inject-tag-lib` in `app` chunk's source file.

```js
import lib from './lib'
console.log('inject-tag-lib')
```

- Configure plugin

```js
const InjectChunkFilenamePlugin = require('webpack-inject-chunk-filename-plugin')

module.exports = {
  context: __dirname,
  entry: {
    app: './example.js' // make sure your chunk have name
  },
  output: {
    libraryTarget: 'umd',
    path: dist,
    filename: 'bundle.js'
  },
  plugins: [
    new InjectChunkFilenamePlugin([
      {
        targetChunk: 'app',
        rules: [
          {
            regex: /inject-tag-lib/,
            injectChunk: 'lib'
          }
        ]
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        lib: {
          name: 'lib', // make sure your chunk have name
          test: /lib/,
          filename: 'lib.[hash:8].js'
        }
      }
    }
  }
}
```

- Build and see what you got

In chunk `app`'s output source, `inject-tag-lib` will be replaced will `lib.51be9832.js`

```js
...
console.log('lib.51be9832.js')
...
```

### Inject chunks to a template file you want

Using `targetTemplate` in your config, `targetTemplate.entry` is your template file's absolute path and `targetTemplate.filename` is the output filename.

```js
const InjectChunkFilenamePlugin = require('webpack-inject-chunk-filename-plugin')


module.exports = {
  context: __dirname,
  entry: {
    app: './example.js'
  },
  output: {
    libraryTarget: 'umd',
    path: dist,
    filename: 'bundle.[hash:8].js'
  },
  plugins: [
    new InjectChunkFilenamePlugin([
      {
        targetTemplate: {
          entry: resolve('./template.js'),
          filename: 'template.[hash:8].js'
        },
        rules: [
          {
            regex: /inject-tag-lib1/,
            injectChunk: 'lib1'
          },
          {
            regex: /inject-tag-lib2/,
            injectChunk: 'lib2'
          }
        ]
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        lib1: {
          name: 'lib1',
          test: /lib1/,
          filename: 'lib1.[hash:8].js'
        },
        lib2: {
          name: 'lib2',
          test: /lib2/,
          filename: 'lib2.[hash:8].js'
        }
      }
    }
  }
}
```

## Options

|Name|Type|Description|
|:--:|:--:|:----------|
|targetChunk|string|chunk to be injected filename|
|targetTemplate.entry|string|template file's absolute path|
|targetTemplate.filename|string|template file's output filename|
|rules[n].regex|object|regex match chunk placeholder|
|rules[n].injectChunk|string|chunk will be injected|
