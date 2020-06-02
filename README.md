# techdown

A markdown flavor for technical documents.

## Get

```sh
$ yarn add techdown
```

## Use

**notes.md**
```md
\`\`\`chart
[Price]->[Total Benefit]
[Quantity]->[Total Benefit]
[Fixed Cost]->[Total Cost]
[Variable Cost]->[Total Cost]
[Total Benefit]->[Total Profit]
[Total Cost]->[Total Profit]
\`\`\`
<center>*Relationship between $P$, $Q$, $B$, $C_0$, $C_V$, $C$, and $\Pi$.*</center>
```

**script.js**
```
const techdown = require('techdown')
const fs = require('fs')

const render = techdown()

const md = fs.readFileSync('./notes.md')

const output = render(md)

console.log(output) // <center><svg version="1.1" baseProfile="full" width="673"...
```

![](https://i.imgur.com/BLXOqQ0.png)

