#!/bin/bash

# find all methods
jik 'call lookup > * + id:last-child' *

# find all ".on" statements
jik 'call lookup > * + id[name=on]:last-child' *

# find all ".on, ".click", ".focus" statements
jik '!call lookup > * + id:any([name=on],[name=click],[name=focus]):last-child' *

# one selector to rule them all, one selector to find them,
# one selector to bring them all, and in the darkness bind them.
jik 'call lookup > !* + id:any([name=on],[name=click],[name=focus]):last-child' '{print($FILE, ":", $NODE.range)}' *
