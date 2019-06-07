const Choice = require("../main/Choice");

test("choice test", () => {
  const samples = 100;
  let i = 0;

  const left = "left";
  const right = "right";

  const choice = Choice.of(left, right).chooseLeftIf(() => i % 2 == 0);
  for (; i < samples; i++) {
    if (i % 2 == 0) {
      expect(choice.get()).toBe(left);
    } else {
      expect(choice.get()).toBe(right);
    }
  }

  const small = Choice.of("small", "large")
    .chooseLeftIf(() => true)
    .get();
  const large = Choice.of("small", "large")
    .chooseLeftIf(() => false)
    .get();

  expect(small).toBe("small");
  expect(large).toBe("large");
});
