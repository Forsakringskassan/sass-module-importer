# @forsakringskassan/sass-module-importer

Import sass files from `node_modules/`, works with and without webpack (`~`)-prefix.

```scss
@import "@fkui/design/fil.scss";
@import "~@fkui/design/anotherFile";
```

## Installation

`npm run --save-dev`

## Usage (esm only)

In your sass compile script, add the importer:

```javascript
import { compileStringAsync } from "sass";
import { moduleImporter } from "./module-importer";

const result = await compileStringAsync(mySCC, {
    importers: [moduleImporter],
});
```
