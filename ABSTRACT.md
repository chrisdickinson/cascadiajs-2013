# what we said we would talk about:

1. the very basics of ASTs and streaming parsers
2. CSS as a general purpose AST selector language
3. building small, composable tools & modules to search & edit JS ASTs
4. using these tools
  1. switch your test framework
  2. find XSS
  3. find unsafe coercions
  4. switch your module system
  5. refactor
  6. intelligently measure statistics

# what I want you to take from this:

1. What an AST is, how to get one from your code, how to use it
    1. it's a different level of abstraction
        1. as in, the world is both describable in macro-events and micro-events,
           no view being more "true".
        2. a bit about those mutually truthful abstractions
        3. it turns out they're really powerful!
            1. an abstraction from this is where we talk about doing 
               optimization / DFA!
    3. it maps a bit more closely to talking about "flow" 
    4. you get one by tokenizing and parsing.
        1. In JS, you can use Acorn or Esprima.
        2. There's a Parser spec! http://mdn.io/parserapi
2. How you could leverage this knowledge in your own code
    1. As JS developers, we're already used to working with
       nested tree structures!
    2. We should use this familiarity and apply it to working with ASTs.
        1. Use CSS selectors for "natural" selection.
        2. Use jQuery-ish primitives to manipulate your code.
            1. "consume what you manipulate"
    3. Why CSS?
        1. CSS is natural for JS developers
        2. Nice streaming properties (only nodes necessary to test are prior nodes + parent nodes -- no future nodes)
        3. CSS4 subject selector really rounds out the niceties
        4. Maps nicely to depth-first traversal model
            1. CSSauron-Falafel (my project)
            2. Grasp
            3. Others?
    4. Demos
        1. Find all jQuery-introduced XSS vectors in your site.
        2. Find all unsafe coercions (lookin' at you, `~~`).
        3. Write a style guide based on selectors.
        4. Safely switch from require.js to browserify (or vice versa).
        5. Safely rewrite your tests from one test framework to another.
        6. Setup git hooks to alert coworkers on other branches of changes that might affect them.
        7. Use js-git to monitor your code over time.
    5. Improvements
        1. Automated Refactoring
            1. Need some loose Data Flow Analysis to attain this
            2. Would be great to see it built on top of these tools
        2. Inversion of Control applied to Tokenizer/Parser
            1. "Is this a keyword?"
            2. "I saw keyword, what do I do?"
        3. Extend CSS into meta-language describing flows of many
           different programming languages (Python, Ruby, JS...)
        4. Speed it up! Apply concepts from the browser (bloom filters for CSS selectors, etc)
           to the parse tree!
3. Wrap-up/Recap: 
    1. By switching between levels of (mutually truthful) abstraction, you get superpowers.
    2. By using information from one level of abstraction to affect another level of abstraction,
       you multiply your expressive potential.
    3. I'm operating at a different level of abstraction than both my AST and my code when I swap
       out Require.JS for CommonJS (don't kill me!)
        1. This is a symbolic level, where I can say "these two symbols are equivalent to my code"
           and swap things out.
        2. This sounds mundane but since we can manipulate flow "hygenically" we can build more
           of these symbolic equivalences.
        3. This is really powerful and exciting, and I hope you get excited by it too and start
           looking for opportunities to make these bridges between levels of abstraction.
    1. AST creation and manipulation is *not* scary.
        1. ASTs are just your code at a different level of abstraction
           (a more... runnable version, say)
        1. Use the AST to ask your code more complicated questions
        2. Use the AST to reduce the risk involved with choosing
           different APIs.

