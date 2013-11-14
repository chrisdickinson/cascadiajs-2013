#!/bin/bash

# select literals that contain `<` (html-looking stuff!)
# and are the direct child of a binary "addition" operation.
jik 'binary[operator=\+] > literal:contains(<)' example.js

# select the binary operation parent of any literal
# containing `<`.
jik '!binary[operator=\+] > literal:contains(<)' example.js


# find 'em all, everyplace.
jik '!binary[operator=\+] > literal:contains(<)' **/*.js
