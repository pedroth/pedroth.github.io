import DOM from "/src/DomBuilder.js";
import LocalStorage from "./src/LocalStorage.js";
import { useState } from "./src/Utils.js";
import getSvg from "./src/Svgs.js";
import posts from "./src/pages/posts.js";
import post from "./src/pages/post.js";
import tags from "./src/pages/tags.js";
import about from "./src/pages/about/about.js";
import search from "./src/pages/search.js";
import main from "./src/pages/main.js";


function title() {
  return DOM.of("a")
    .inner("Pedroth")
    .attr("href", "/")
    .attr("class", "navLogo");
}

function nav(actualPage) {

  return DOM.of("nav")
    .append(
      ...[
        { id: "posts", text: "Posts", url: "?p=posts" },
        { id: "tags", text: "Tags", url: "?p=tags" },
        { id: "about", text: "About", url: "?p=about" },
      ]
        .map(({ id, text, url }) =>
          DOM
            .of("a")
            .addClass("specialLink")
            .addClass(id === actualPage ? "active" : "")
            .attr("href", url)
            .inner(text)
        )
    )
}

function searchButton(isActive) {
  return DOM.of("button")
    .addClass("specialIcon")
    .addClass(isActive ? "active" : "")
    .inner(getSvg("/assets/search.svg"))
    .event("click", () => {
      window.location.href = "?p=search";
    })
}

function themeButton() {
  const [getTheme, setTheme, onThemeChange] = useState(LocalStorage().getItem("theme") || "dark");

  const button = DOM
    .of("button")
    .addClass("specialIcon")
    .event("click", () => {
      setTheme(theme => {
        let nextTheme = theme;
        if (theme === "dark") nextTheme = "light";
        else nextTheme = "dark";
        LocalStorage().setItem("theme", nextTheme);
        return nextTheme;
      });
    })

  const updateTheme = (aTheme) => {
    if (aTheme === "light") button.inner(getSvg("/assets/dark_mode.svg"));
    else button.inner(getSvg("/assets/light_mode.svg"));
    if (aTheme === "light") {
      document.body.style.backgroundColor = "var(--background-color-light)";
      document.body.style.color = "var(--text-color-light)";
    } else {
      document.body.style.backgroundColor = "var(--background-color)";
      document.body.style.color = "var(--text-color)";
    }
  }

  onThemeChange(newTheme => {
    updateTheme(newTheme);
  })
  updateTheme(getTheme());
  return button;
}

function tools(actualPage) {
  return DOM.of("div")
    .addClass("tools")
    .append(
      searchButton(actualPage === "search"),
      themeButton()
    )
}

function header(page) {
  return DOM.of("header")
    .append(
      DOM.of("div")
        .addClass("navDiv")
        .append(title())
        .append(nav(page))
        .append(tools(page))
    )
    .append(DOM.of("hr"))
}

function footer() {
  return DOM.of("footer")
    .append(DOM.of("hr"))
    .append(
      DOM.of("div")
        .append(
          DOM.of("p")
            .append(
              DOM.of("a")
                .addClass("specialIcon")
                .attr("href", "https://github.com/pedroth")
                .inner(getSvg("/assets/github.svg")),
              DOM.of("a")
                .addClass("specialIcon")
                .attr("href", "https://www.youtube.com/@pedroth3")
                .inner(getSvg("/assets/youtube.svg")),
              DOM.of("a")
                .addClass("specialIcon")
                .attr("href", "https://twitter.com/pedroth9")
                .inner(getSvg("/assets/x-twitter.svg")),
              DOM.of("a")
                .addClass("specialIcon")
                .attr("href", "/feed/rss.xml")
                .inner(getSvg("/assets/rss.svg"))
            ),
          DOM.of("p")
            .inner("© 2023 Pedroth")
        )
    )
}

//========================================================================================
/*                                                                                      *
 *                                         MAIN                                         *
 *                                                                                      */
//========================================================================================

(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get("p") || "";
  const split = pageParam.split("/");
  const page = split.length > 0 ? split[0] : pageParam;
  const navMap = {
    post,
    tags,
    about,
    posts,
    search,
  }
  const content = page in navMap ?
    await navMap[page](pageParam) :
    await main();

  DOM.ofId("root")
    .append(header(page))
    .append(content)
    .append(footer())
    .addClass("loaded")

})();
