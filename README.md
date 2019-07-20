# gatsby-transformer-toml

Use the latest version of [TOML](https://github.com/toml-lang/toml) in your
Gatsby site and control what [GraphQL](https://graphql.org/) type a file
should use.

`gatsby-transformer-toml` is a [Gatsby](https://gatsbyjs.org) plugin to
transform [TOML](https://github.com/toml-lang/toml) files into Gatsby nodes.

It uses [`ion-parser`](https://www.npmjs.com/package/ion-parser) to
parse TOML files. It's fast, small and has no dependencies.


## Problem

[Gatsby's `gatsby-transformer-toml`](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-toml)
works only form TOML 0.4 and it makes a GraphQL type per file.

If you find yourself in need of controlling what types should be used for your
TOML files, this plugin may be a solution for you.


## Install

```sh
yarn add @arnau/gatsby-transformer-toml
```


## Usage

```javascript
// In your gatsby-config.js
plugins: ['gatsby-transformer-toml']
```

## Example

Let's say you have a TOML files without a `type` attribute:

```toml
# settings.toml

description = "My settings outside gatsby-config.js"

[licence]
id = "mit"
label = "MIT License"
url = "https://choosealicense.com/licenses/mit/"

[[editors]]
id = "arnau"
name = "Arnau Siches"
```

By default if no type is provided it uses `TOML` so you can query the above
like:

```graphql
query {
  toml {
    description
    licence {
      label
      url
    }
  }
}
```

Resulting in:

```javascript
{
  data: {
    toml: {
      description: "My settings outside gatsby-config.js",
      licence: {
        label: "MIT License",
        url: "https://choosealicense.com/licenses/mit/"
      }
    }
  }
}
```

If you have two TOML files with different structures, Gatsby will merge them
under the same type. Enter the `type` attribute:

```toml
# data/tools/gatsby.toml

type = "Tool"
id = "gatsby"
name = "Gatsby"
url = "https://www.gatsbyjs.org/"
```

```toml
# data/tools/netlify.toml

type = "Tool"
id = "netlify"
name = "Netlify"
url = "https://www.netlify.com/"
```

This time we can query specifically all nodes of type `Tool`:

```graphql
query {
  allTool {
    name
    url
  }
}
```

Resulting in:

```javascript
{
  data: {
    allTool: [
      {
        name: "Gatsby",
        url: "https://www.gatsbyjs.org/"
      },
      {
        name: "Netlify",
        url: "https://www.netlify.com/"
      },
    ]
  }
}
```

Finally, if you need to query all nodes generated from TOML files, you can
rely on the fact that all of them have the internal media type
`application/toml`:

```javascript
// gatsby-node.js

exports.onCreateNode = ({ node, actions }) => {
  if (node.internal.mediaType === 'application/toml') {
    // do stuff
  }
}
```

## Options

### `defaultType`

The `defaultType` option allows to override the default type `TOML`. For
example:

```javascript
// gatsby-config.js

plugins: [
  {
    resolve: 'gatsby-transformer-toml',
    options: {
      defaultType: 'ION'
    }
  }
]
```

### `extensions`

The `extensions` option allows to override the default extension list. For
example:

```javascript
// gatsby-config.js

plugins: [
  {
    resolve: 'gatsby-transformer-toml',
    options: {
      defaultType: 'ION',
      extensions: ['toml', 'ion']
    }
  }
]
```


## Development

This plugin is fairly trivial, the following should be enough to get you
started:

```sh
yarn install && yarn test
```


## Licence

Licensed under the [MIT licence](./LICENCE)
