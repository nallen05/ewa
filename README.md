
# Ewa.js

## Overview

Ewa is a reflective object-oriented DOM extention for hacking interactive browser-based UI
mockups using JS+HTML+CSS.

Ewa is the anti-MVC framework: Ewa lets you embed model and control code directly into the
view (DOM) in order to create an interactive interface with as little typing and cognative
load as possible.

Once an element has been turned into a dynamic, reflective Ewa element using `Ewa.init` it
gains the following capabilities:

### Stack-based statefullness

Ewa elements have at any time one (and only one) "state". A "state" is an arbitrary
number of key/val pairs temporarily superimposed over the element's original key/val
pairs (that it originally got from its attributes, DOM, or browser-specific
implementation).

Ewa elements can be coaxed in an out of different states (using `element.switchState`,
`element.launchState`, `element.launchStateBecause` or `element.popState`). Ewa
elements have a stack-based state model: state is properly managed when pushing and
popping to an element's state stack.

A state being popped off the state stack can return multiple return arguments to the
continuation function associated with the previous state. This enables, for instance,
a mockup of a mail application to call a mockup of an address book application and
for the mockup of the mail application to know which entry in the address book the
user selected.

### DOM-based inheritence

The methods `element.getInherited` and `element.setInherited` enable an Ewa element
to get and set the key/val pairs of its ancestors.

### Memory

Ewa elements remember the state they were in when they were initialized and can be
reinitialized with the method `element.reinit`

## Other Notes:

  * If supplied, the values of the `init` and `exit` fields of a state should be functions.
    These functions will be called when the element enters and exits the state, respectively.
    The arguments to the function are the arguments given to `Ewa.init`. The element can be
    accessed within the body of these functions with the special `this` keyword.

  * Ewa works best when you explicitly pass information down to nested Eqa elements when
    they are initialized using `Ewa.init`, `Ewa.initDescendentsByClassName`, or
    `element.initDescendentsByClassName` and only use `element.getInherited` and
    `element.setInherited` when an Ewa element needs to _change_ the value of fields
    inherited by an ancestor.

  * In my own code I use the convention of appending (but not prepending) a double underscore
    (\__) to the names of states (like `addressBook__`), only because it doesn't
    conflict with any other naming convention that I know of...

## Reference:

* `Ewa.init(element, state[, arg1, arg2, arg3, arg4, arg5])`

- - -

Turns `element` into a dynamic, reflective Ewa element with stack-based statefulness.

`state` is an associative array of key/val pairs that can be anything from standardized
DOM attributes (such as onClick), to browser-specific DOM attributes, to arbitrary field
names (Ewa is portable but is intended to be used to write non-portable code; Ewa is for
exploratory UI prototyping under controlled conditions and makes no attempt to prevent
the Ewa programmer from writing non-portable code).

If `state` has the special `init` or `exit` fields, then their values should be functions
that will be called when the element enters and exits `state`, respectively. `arg1`, `arg2`,
`arg3`, `arg4`, and `arg5` are passed to the `init` or `exit` functions. `element` can be
acces

* `Ewa.initDescendentsByClassName(element,searchClass, state[, arg1, arg2, arg3, arg4, arg5])`

- - -

Calls `Ewa.init` on all descendents of `element` with the class `searchClass` with `state`
and `arg1`, `arg2`, `arg3`, `arg4`, `arg5`

* `Ewa.reinitDescendentsByClassName(element,searchClass)`

- - -

Calls `element.reinit` on all descendents of `element` with `searchClass`

* `Ewa.getDescendentsByClassName(element, searchClass)`

- - -

Returns an array of all the descendents of `element` with the class `searchClass`. Used
by `Ewa.initDescendentsByClassName` and `Ewa.reinitDescendentsByClassName`

The following methods are added to a DOM element once it has been turned into an Ewa element
using `Ewa.init`:

* `element.getInherited(key)`

- - -

Returns the value associated with `key` for the first ancsestor-or-self element that
has the key.

* `element.setIngerited(key, value)`

- - -

Sets the value associated with `key` to `value` for the first ancestor-or-self element
that has the key.

* `element.getInheritedKeyOwnder(key)`

- - -

Returns the first element-or-self element that has the key `key`

* `element.switchState(state[, arg1, arg2, arg3, arg4, arg5])`

- - -

Switches element to state `state`, but first cleaning up the key/val pairs associated
with the current state and returning them to their previous values. `init` and `exit`
functions are run at this time, `arg1`, `arg2`, `arg3`, `arg4`, and `arg5` are passed to
the `init` function if provided.

* `element.launchState(state[, arg1, arg2, arg3, arg4, arg5])`

- - -

Like `element.switchState` except the current state can later be returned to be calling
`element.popState`.

* `element.popState(arg1, arg2, arg3, arg4, arg5)`

- - -

Returns element to the previous state. `arg1`, `arg2`, `arg3`, `arg4`, and `arg5` are
passed to the continuation function associated with the previous state (if there is one).

* `element.launchStateBecause(k,state[, arg1, arg2, arg3, arg4, arg5])`

- - -

like `element.launchState` except the funciton `k` gets called with the arguments from
`element.popState` when `state` is returned

* `element.initDescendentsByClassName(searchClass,state[, arg1, arg2, arg3, arg4, arg5]);`

- - -

Calls `Ewa.init` on all descendents of element with the class `searchClass` with `state`
and `arg1`, `arg2`, `arg3`, `arg4`, `arg5`

* `element.reinitDescendentsByClassName(searchClass,state[, arg1, arg2, arg3, arg4, arg5]);`

- - -    

Calls `element.reinit` on all descendents of `element` with `searchClass`

* `element.getDescendentsByClassName(selectClass)`

- - -

Returns an array of all the descendents of `element` with the class `searchClass`. Used
by `element.initDescendentsByClassName` and `element.reinitDescendentsByClassName`

