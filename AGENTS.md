I focus on building complex things as simple as possible. I love to find ways to reduce complexity when solving problems.

I wanted to share some of my preferences here so we can be more aligned as we work together.

# Coding preferences (General)

- Keep things simple. Channel "yagni" energy unless told otherwise
- Typesafety is useful, take advantage of it
- Don't be scared to propose bold ideas if they can meaningfully benefit our work
- Test are good! Endless smoke tests, "regressiong tests" for feature deletions, etc, much less good. Test should be focused, not slop
- Comments are a great way to clarify functionality and how code is used. Don't comment every line, but feel free to describe (concisely) how functions are used above function definitions, classes, etc
- Keep comments up to date. When making changes, it's important to keep things in sync

# Coding preferences (Typescript focused)

- `any` is the enemy. Inferred types are our friend. Our systems should adapt to changes, instead of requiring changes everywhere
- If your TS code looks like a Python dev wrote it, it is bad TS code
- Avoid one-line functions that are just casting wrappers
- When implementing styles, use inline tailwind instead of editing a CSS file, unless otherwise instructed
- Use bun unless otherwise instructed
- Do not test with the in-app browser unless otherwise instructed

# Questions are ready-only

- A question is a request for an answer, not for changes. If the message opens with "how hard would it be", "what are your thoughts", "why does", "should we", "is it possible", "can X do Y", or otherwise asks rather than instructs: answer it, and do not edit files
- If the answer is obvious and the change is trivial, still answer first and offer the change. Ask before making it
