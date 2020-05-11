# webpack-inject-chunk-filename-plugin

Webpack Plugin that injects chunks filename to outputs or any files you define.

## Instill

`npm i webpack-inject-chunk-filename-plugin -D`

## Usage

### Inject chunks to another chunk

Inject chunks filename to outputs. you should make sure each chunks have name, so that the plugin can find it.

Suppose you have two chunks, `app` and `lib`. You want to inject chunk `lib`'s output filename to chunk `app`'s output source.
