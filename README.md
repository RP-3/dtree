[![NPM](https://nodei.co/npm/dtree.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/dtree/)




dtree
-------------

A simple command-line tool to display the dependency tree of a single js file that requires external modules. 

To install: 

```
npm install -g dtree (sudo may be required).
```

To use, navigate to the folder with your js project and type:

```
dtree
```
or from any folder type:
```
dtree <path to your file>
```

## examples

### Normal Use
```
dtree myFileThatRequiresThings.js
```

produces

```
server.js
├─ index
│  ├─ fs
│  └─ restify
├─ config
├─ socketDW
│  ├─ net
│  └─ json-socket
└─ dHelpers.js 
```

### Error logging

Circular dependencies appear as

```
 formulae.js
├─ sum.js
│  └─ formulaParser.js
│     └─ resolver.js (Circular! Requires formulae.js)
│        └─ validate.js
│           └─ check.js
├─ product.js
│  └─ formulaParser.js
│     └─ resolver.js (Circular! Requires formulae.js)
│        └─ validate.js
│           └─ check.js
└─ operators.js
   └─ formulaParser.js
      └─ resolver.js (Circular! Requires formulae.js)
         └─ validate.js
            └─ check.js 

Warning: One or more cyclcal dependencies detected. See tree for details.
```

Failed modules appear as

```
Warning: Failed to load module at: ./server/index
Warning: Failed to load module at: ./config
Warning: Failed to load module at: ./socket/socketDW
Warning: Failed to load module at: ./socket/dwHelpers

 server.js
├─ index
├─ config
├─ socketDW
└─ dwHelpers 

Try 'npm install' and make sure all dependencies are loaded. 
```

dtree will draw out your dependency tree to the command line, and also log any modules that failed to load or any circular dependencies that may exist. 

Please submit issues to: https://github.com/RP-3/dtree/issues

Pull requests welcome :)
