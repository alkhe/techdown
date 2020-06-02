# techdown

A markdown flavor for technical documents.

## Get

```sh
$ yarn add techdown
```

## Use

**notes.md**
~~~html
```chart
[Price]->[Total Benefit]
[Quantity]->[Total Benefit]
[Fixed Cost]->[Total Cost]
[Variable Cost]->[Total Cost]
[Total Benefit]->[Total Profit]
[Total Cost]->[Total Profit]
```
<center>*Relationship between $P$, $Q$, $B$, $C_0$, $C_V$, $C$, and $\Pi$.*</center>
~~~

**script.js**
```js
const techdown = require('techdown')
const fs = require('fs')

const render = techdown()

const md = fs.readFileSync('./notes.md')

const output = render(md)

console.log(output) // <center><svg version="1.1" baseProfile="full" width="673"...
```

Dump the output of `render` into an HTML file, and include the katex script and stylesheet:

```html
<html>
  <head>
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css' integrity='sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq' crossorigin='anonymous'>
    <script src='https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js' integrity='sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz' crossorigin='anonymous'></script>
  </head>
  <body>
    <!-- render output goes here -->
  </body>
</html>
```

![](https://i.imgur.com/BLXOqQ0.png)

