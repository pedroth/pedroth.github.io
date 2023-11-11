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
- All tags visual representation

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
	date: String[],
    updated: Date(String)
	src: Address(String),
	tags: Array<String>
}
```

## Js first

It will be a single page application using _vanilla js_

# Scripts

To run the scripts you need to run it from the root `./`, like this:

`sh scripts/...`

or 

`bun scripts/...`

or

`node scripts/...`

> The `scripts/blog-builder.js build-java` only run using `node`, there is a [bug in bun](https://github.com/oven-sh/bun/issues/6992) that blocks running this particular command.

# Dependencies

- [bun.js](https://bun.sh/) 
- [docker](https://www.docker.com/)
- [ffmpeg](https://www.ffmpeg.org/) (this is useful to run [webm2webp.sh](./scripts/webm2webp.sh))