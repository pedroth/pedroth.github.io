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

Most of the useful scripts can be found in the [package.json](./package.json), scripts section. Therefore you should run those, by using `bun run ...` or `node run ...<name of script>`.

If you really need to run the scripts you need to run it from the [root `./`](./), like this:

`sh scripts/...`

or 

`bun scripts/...`

or

`node scripts/...`

> The `scripts/blog-builder.js build-java` only run using `node`, there is a [bug in bun](https://github.com/oven-sh/bun/issues/6992) that blocks running this particular command.


# Dependencies

- [bun.js](https://bun.sh/)
- [node.js](https://nodejs.org/) // to be removed after [bug](https://github.com/oven-sh/bun/issues/6992) is solved.
- [docker](https://www.docker.com/)
- [ffmpeg](https://www.ffmpeg.org/) (this is useful to run [webm2webp.sh](./scripts/webm2webp.sh))


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
- Run `bun run build-posts` in the root.


# TODO

- **Add** different view on tags (like [this](https://mcyoung.xyz/tags.html))
- Add email subscription (?)