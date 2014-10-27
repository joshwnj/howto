# modwiki

distributed offline-first markdown wiki with multi-master replication

# example

First write a new document in markdown:

    # content addressable haiku

    ```
    Key of document
    is the hash of its content.
    Addressable blob.
    ```
    
    # tags
    
    [haiku](tag:haiku) [poem](tag:poem)

Now save the document to `modwiki`:

```
$ modwiki create < doc.md
0985d816191c936e86827b78bfb4aed957c1e483d3585e04cf61f88927428bae
```

Now we can open the document in `$PAGER` with:

```
$ modwiki show 0985d816191c936e86827b78bfb4aed957c1e483d3585e04cf61f88927428bae
```

Or to edit the document in `$EDITOR`, just use `modwiki edit`:

```
$ modwiki edit 0985d816191c936e86827b78bfb4aed957c1e483d3585e04cf61f88927428bae
```

and we can search for documents with

# usage

```
modwiki search QUERY

  Search for articles containing QUERY using a full-text scan.

modwiki browse TAG

  List all articles matching TAG.

modwiki recent

  Show all recent activity.

modwiki read HASH

  Print an article to stdout.

modwiki show HASH

  Open an article in $PAGER.

modwiki edit HASH

  Open an article in $EDITOR and save a new version.

modwiki create

  Create a new document from content on stdin.

modwiki [push|pull|sync] {URI}

  Replicate according to a push, pull, or sync strategy.
  If URI is given, replicate over full-duplex http.
  Otherwise, replicate over stdin and stdout.

```

# methods

``` js
var modwiki = require('modwiki')
```

`modwiki` is a [wikidb](https://npmjs.org/package/wikidb) instance. Consult the
wikidb (and [forkdb](https://npmjs.org/package/forkdb)) documentation for the
rest of the methods not mentioned below.

## var md = modwiki(db, opts)

Create a modwiki instance `md` from a leveldb handle `db`.

## var w = md.createWriteStream(meta, cb)

Return a writable stream `w` that should be written markdown content.

The first header is used as the document key/title.

Tags are gathered from links that start with `tag:`. For example:

```
[cookie](tag:cookie)
```

adds a tag for `cookie` to the wiki page.

# install

With [npm](https://npmjs.org), to get the command, do:

```
npm install -g modwiki
```

or to get the library, do:

```
npm install modwiki
```

# license

MIT
