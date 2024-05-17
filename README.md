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
	date: Date(String),
	lastUpdate: Date(String),
	src: Address(String),
	tags: Array<String>
}
```

> `date` should be the creation date

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

# Dependencies

- [bun.js](https://bun.sh/)
- [node.js](https://nodejs.org/), not really a dependency, you can just use `bun`
- [docker](https://www.docker.com/) (this is useful to run [build-java.js](./scripts/build-java.js))
- [ffmpeg](https://www.ffmpeg.org/) (this is useful to run [webm2webp.sh](./scripts/webm2webp.sh))