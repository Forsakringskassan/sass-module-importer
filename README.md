# @forsakringskassan/sass-module-importer

Import sass files from packages in `node_modules/`, works with and without webpack (`~`)-prefix.

```scss
@import "@fkui/design/fil.scss";
@import "~@fkui/design/anotherFile";
```

This plugin can also be used to include Sass files from a library's `main` or `exports` field.

## Installation

`npm install --save-dev @forsakringskassan/sass-module-importer`

## Usage (esm only)

In your sass compile script, add the importer:

```javascript
import { compileStringAsync } from "sass";
import { moduleImporter } from "@forsakringskassan/sass-module-importer";

const result = await compileStringAsync(mySCSS, {
    importers: [moduleImporter()],
});
```
