const Function = require("../main/Function");

test("compose test", () => {
  const h = Function.of(x => x * x).compose(Math.sqrt);
  const j = Function.of(Math.sqrt).compose(x => x * x);
  expect(h.f(2)).toBeCloseTo(2);
  expect(j.apply(2)).toBeCloseTo(2);
  expect(j.get()(2)).toBeCloseTo(2);
});
