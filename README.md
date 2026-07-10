# Pedroth's Corner

Website where I share some notes and projects about topics I like.

Check [here](https://pedroth.github.io/)

## Concept

Pedroth's Corner is my personal website. Here I will:

- Write about things I like
- Distill knowledge
- Showcase demos and software projects
- I will also share my contact and places on the web, such as youtube, github, twitter, etc...

## Features

- All post will be organized by:
  - Set of tags (similar post should have common tags)
  - Creation and update date
  - Title
- Search engine
  - Search by title and tag
- Visual post representation
- Posts written in [nabladown.js](https://github.com/pedroth/nabladown.js)
- Minimal dependencies
- Minimalistic design
- Visual representation of tags

# Architecture

## Folder Structure
- /assets
- /database
- /feed
- /lib
- /others
- /posts
- /scripts
- /src
- `.eslintrc.yml`
- `.gitignore`
- `bundle.js`
- `favicon.ico`
- `index.css`
- `index.html`
- `index.js`
- `LICENSE`
- `macros.js`
- `package.json`
- `README.md`

## DB Structure

```javascript
DB := {
    posts: Array<Post>
}

Post := {
	id: String,
	title: String,
	creationDate: String<Date: dd/mm/yyyy>,
	lastUpdateDate: String<Date: dd/mm/yyyy>,
	tags: Array<String>
}
```

## Js first

It will be a single page application using _vanilla js_, described [here](/src)

# Scripts

Most of the useful scripts can be found in the [package.json](./package.json), scripts section. Run them with `bun run <name>` from the root `./`.

| Script | Description |
|---|---|
| `build` | Alias for `build-blog`. Full build pipeline. |
| `build-blog` | Runs the full pipeline: `build-lib` → `build-posts` → `build-images` → `build-java` → `build-about` → `rss`. |
| `build-lib` | Installs dependencies and bundles the JS library (`bundle.js`). |
| `build-posts` | Processes and builds all post artifacts. Accepts `-p, --post <id>` to build a single post by ID. |
| `build-images` | Generates post images in various resolutions (requires `ffmpeg`). |
| `build-java` | Compiles Java-related post artifacts. |
| `build-about` | Builds the about page. |
| `rss` | Generates the RSS feed (`feed/rss.xml`). |
| `serve` | Starts a local HTTP server to preview the site. |
| `watch-post` | Watches a post for changes and rebuilds it on save. |
| `clean` | Removes `node_modules` and `lib` directories. |
| `test` | Runs the test suite. |

If you need to run a script file directly, do it from the root `./`:

`bun scripts/...`

or

`node scripts/...`


# Dependencies

## General dependencies 
- [bun.js](https://bun.sh/) or [node.js](https://nodejs.org/)
- [docker](https://www.docker.com/)
- [ffmpeg](https://www.ffmpeg.org/) (this is useful to run [build-images.js](./scripts/build-images.js))

## Js dependencies
- [nabladown.js](https://github.com/pedroth/nabladown.js)
- [textFit](https://github.com/STRML/textFit)


# Using Blog Builder

The blog builder is a set of scripts designed to update the website. It updates the database, creates the images in various resolutions, create/updates various artifacts (e.g the [build-java script](/scripts/build-java.js))

## Creating a new post

- Create new _folder_ with the *unique id* of the post in _posts folder_
- Inside this _folder_ create a `.nd` file with the name equal to its *unique id*
- The first lines the `.nd` file, should be a comment with the following format:
	- title: String
	- creationDate: String<Date: dd/mm/yyyy> (note: dd=00..31 / mm=01..12 / yyyy=0000....9999)
	- lastUpdateDate: String<Date: dd/mm/yyyy>
	- tags: Array<String>
- Add `.webm` video about your post with its name equal to its *unique id*
- Run `bun run build-blog` in the root.

> Note: titles with `:` should escape it with `\:`.

# TODO

- **Add** different view on tags (like [this](https://mcyoung.xyz/tags.html))
- Add email subscription (?)