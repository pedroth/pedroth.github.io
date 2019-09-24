const DomBuilder = require("../main/DomBuilder");

test("Dom creation", () => {
  expect(DomBuilder.of("div").build()).toStrictEqual(
    document.createElement("div")
  );
});
