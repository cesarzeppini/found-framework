# Good tests

Reference for the "write the test" step of the slice loop in [`SKILL.md`](../SKILL.md). A slice gate that only checks the suite went green doesn't check that the test was worth writing — a test can pass for reasons that have nothing to do with the behaviour it claims to cover. This is what to check before calling the test done, not after the slice has already moved on.

Syntax below is illustrative — write it in whatever the project's stack and test runner actually are.

## What a good test is

A test verifies behaviour through the **seam** named in the slice's task package — the interface a real caller actually uses, not the mechanism behind it. The code inside a slice can be rewritten completely and the test shouldn't need to change, because it never looked at how the behaviour was produced — only at what came out through that seam.

```text
GOOD  a signed-out visitor submitting the invite form gets a confirmation
      and the invite becomes acceptable
BAD   submitting the form calls inviteService.send() with the right args
```

The good version is the slice's test expectation from `tasks.md`, restated as an assertion. If the test you're about to write doesn't read like that expectation, it's testing the wrong thing.

## Two ways a test lies about protecting the slice

### Implementation-coupled

The test reaches past the interface to check how the result was produced, instead of checking the result. The tell: it breaks when the implementation is refactored even though the behaviour didn't change.

```text
BAD   mocks an internal collaborator and asserts it was called
BAD   asserts on call counts or call order between internal functions
BAD   queries the database directly to confirm a row was written,
      instead of calling the read path the feature actually exposes
BAD   reaches into private state or calls a private method to check the result

GOOD  calls the same public entry point a real caller would, then reads
      the result back through the same interface a real caller would use
```

A test that can only be written by importing something the interface doesn't expose is a sign the interface is the wrong shape for what's being tested, not a reason to reach past it.

### Tautological

The expected value is computed the same way the code under test computes it, so the test agrees with the code by construction — it cannot fail even if the logic is wrong, because a wrong version of the logic produces the same wrong "expected" value on both sides.

```text
BAD   const expected = items.reduce((sum, i) => sum + i.price, 0)
      expect(calculateTotal(items)).toBe(expected)

GOOD  expect(calculateTotal([{price: 10}, {price: 5}])).toBe(15)
```

The expected value has to come from somewhere the code under test didn't touch: a literal worked out by hand, a known-good fixture, a number from the spec. If writing the expectation required re-deriving the formula, it's not an expectation — it's a mirror.

## The check before moving on

For the test just written, ask: if I reverted the implementation to something subtly wrong — off-by-one, wrong branch taken, a field silently dropped — would this test go red? If the honest answer is no, the slice hasn't passed even though the suite is green, and RULES.md's rule applies here in full: a slice without a real test for its behaviour hasn't passed.
