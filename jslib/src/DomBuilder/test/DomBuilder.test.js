const DomBuilder = require("../main/DomBuilder");

test("Dom creation", () => {
  // string
  expect(DomBuilder.of("div").build()).toStrictEqual(
    document.createElement("div")
  );
  // html element
  expect(DomBuilder.of(document.createElement("div")).build()).toStrictEqual(
    document.createElement("div")
  );
});

test("Dom append", () => {
  const div = document.createElement("div");
  div.appendChild(document.createElement("div"));
  // append html element
  expect(
    DomBuilder.of("div")
      .append(DomBuilder.of("div").build())
      .build()
  ).toStrictEqual(div);

  // append DomBuilder
  expect(
    DomBuilder.of("div")
      .append(DomBuilder.of("div"))
      .build()
  ).toStrictEqual(div);
});

test("Dom append array", () => {
  const div = document.createElement("div");
  div.appendChild(document.createElement("div"));
  div.appendChild(document.createElement("div"));
  div.appendChild(document.createElement("div"));
  expect(
    DomBuilder.of("div")
      .append([1, 2, 3].map(() => DomBuilder.of("div")))
      .build()
  ).toStrictEqual(div);
});

test("Dom set attribute", () => {
  const div = document.createElement("div");
  div.setAttribute("x", 1);
  expect(
    DomBuilder.of("div")
      .attr("x", 1)
      .build()
  ).toStrictEqual(div);
});

test("Dom event listener", () => {
  const eventFunction = e => {};

  const div = document.createElement("div");
  div.addEventListener("click", eventFunction);

  expect(
    DomBuilder.of("div")
      .event("click", eventFunction)
      .build()
  ).toStrictEqual(div);
});

test("Dom set inner html", () => {
  const div = document.createElement("div");
  div.innerHTML = "test";
  expect(
    DomBuilder.of("div")
      .inner("test")
      .build()
  ).toStrictEqual(div);

  expect(
    DomBuilder.of("div")
      .html("test")
      .build()
  ).toStrictEqual(div);
});
