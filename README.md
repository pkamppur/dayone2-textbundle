# DayOne2 TextBundle Conversion Utilities

[![Build Status](https://travis-ci.org/bsingr/dayone2-textbundle.svg?branch=master)](https://travis-ci.org/bsingr/dayone2-textbundle)

This project was created to export and import multiple [DayOne2](https://dayoneapp.com/) journals to other note-taking applications that support the [TextBundle](http://textbundle.org/) format such as [Ulysses](https://ulysses.app) and [Bear](https://bear.app/).

As of 2019 a lot of note-taking applications support the [TextBundle](http://textbundle.org/) format for data exchange. TextBundle is just a thin wrapper around [Markdown](https://daringfireball.net/projects/markdown/syntax) with support for attachments (e.g. embedded images).

Sadly DayOne2 does not support TextBundle out of the box, this project solves this.

## Features

- Reads [DayOne2](https://dayoneapp.com/) journal in JSON format
- Converts into [TextBundle](http://textbundle.org/) `.textbundle` files (`.textpack` ZIP files also supported, but needs changing parameters in code)
- Supports photo and PDF attachments

## How To

1. Export JSON zip from Day One: [See here](https://dayoneapp.com/guides/tips-and-tutorials/exporting-entries/)
2. Extract zip contents
3. Create output directory
4. Run CLI tool `dayone2-textbundle` conversion for each Journal.json

   dayone2-textbundle <dayone2-export-json-file> <target-dir>

5. Import `.textbundle` files to your favorite [app](http://textbundle.org/)
6. Profit!

## Supported Environments

Node.js 20+ and macOS (ok, because DayOne2 is macOS only ;-)).

Note: Linux or Windows might work, but things like creation dates might be broken.

## Installation

This project uses and was tested with [Node.js](https://nodejs.org/) v20.

    npm install dayone2-textbundle

## Running locally without installing

If you've cloned repo locally, you can run converter using

    npm i
    npx dayone2-textbundle <dayone2-export-json-file> <target-dir>

## Contribute

Make it pass `npm test` and `npm lint`, then send your pull-request ;-)

## LICENSE

See [LICENSE](LICENSE).
