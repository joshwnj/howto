# howto

offline wiki for programming guides (or whatever else)

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

Now save the document to `howto`:

```
$ howto create < doc.md
0985d816191c936e86827b78bfb4aed957c1e483d3585e04cf61f88927428bae
```

Now we can open the document in `$PAGER` with:

```
$ howto show 0985d816191c936e86827b78bfb4aed957c1e483d3585e04cf61f88927428bae
```

Or to edit the document in `$EDITOR`, just use `howto edit`:

```
$ howto edit 0985d816191c936e86827b78bfb4aed957c1e483d3585e04cf61f88927428bae
```

and we can search for documents with `howto search`:

```
# content addressable haiku
hash: e4abc5bc3000f09009a1570a01a70bdac4a2fae5e20a4a391564b399ff813c63

```

# usage

```
howto search QUERY

  Search for articles containing QUERY using a full-text scan.

howto browse TAG

  List all articles matching TAG.

howto recent

  Show all recent activity.

howto read HASH

  Print an article to stdout.

howto show HASH

  Open an article in $PAGER.

howto edit HASH

  Open an article in $EDITOR and save a new version.

howto create

  Create a new document from content on stdin.

howto [push|pull|sync] {URI}

  Replicate according to a push, pull, or sync strategy.
  If URI is given, replicate over full-duplex http.
  Otherwise, replicate over stdin and stdout.

```

# methods

``` js
var howto = require('howto')
```

`howto` is a [wikidb](https://npmjs.org/package/wikidb) instance. Consult the
wikidb (and [forkdb](https://npmjs.org/package/forkdb)) documentation for the
rest of the methods not mentioned below.

## var md = howto(db, opts)

Create a howto instance `md` from a leveldb handle `db`.

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
npm install -g howto
```

or to get the library, do:

```
npm install howto
```

# license

MIT
