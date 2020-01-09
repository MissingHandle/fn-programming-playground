/**
So what the fuck is a monad anwyay?

I've gotten far enough in software development and functional programming that I've used things
that I have been told are monads, like "The Either Monad", and I've understood how to use them.
I can write code that uses Either.  But at a certain point down the functional programming
rabit hole, my understanding falls apart, and I want to change that.

This repo is about studying category theory enough that I can build my functiona programming
skills on a rock solid foundation.

My descriptive definition of a Monad is that a Monad seems to be like a box, inside of which you
will find one of two things. Then, you can imbue meaning to those two things as you see fit.

but as of time of writing, I can't really define what a monad is, in the formal sense.

What I can say right now, is that it seems that in order to be a monad,
something has to first be "a Functor".

Things seem this way specifically because of
 1. https://gcanti.github.io/fp-ts/introduction/core-concepts
 2. https://gcanti.github.io/fp-ts/type-classes.svg

>>>
  A Functor is a type constructor which supports a mapping operation called map.
  Instances must satisfy the following laws:

  Identity: F.map(fa, a => a) = fa
  Composition: F.map(fa, a => bc(ab(a))) = F.map(F.map(fa, ab), bc)

So what does that mean? Well, it looks like it's defining what it means to be a Functor by
defining the semantics of map:

1. If you give this function map the arguments of:
   - a specific value
   - the Identify function,
   then it must return the specific value.

Before moving on to condition 2, let's work through this.
*/

// if you find the "T" here confusing, read this:
// https://www.typescriptlang.org/docs/handbook/generics.html
function identity<T>(a: T): T {
  return a;
}

const meetsIdentity = {
  map: (value: any, _fn: (a: any) => any) => {
    return value;
  },
};

const failsIdentity = {
  map: (_a: any, _fn: (a: any) => any) => {
    return 'always-this';
  },
};

console.log(`testing identity\n`);
let r1 = meetsIdentity.map('anything', identity);
console.log(`meetsIdentity.map("anything", identity): ${r1}`);
let r2 = failsIdentity.map('anything', identity);
console.log(`failsIdentity.map("anything", identity): ${r2}`);
console.log(`\n\n`);

/**
So the requirement that map respect identity seems pretty clear.
But I think it's worth pointing out that you can skirt the requirement
to actually use the function argument with only this condition.

I'm thinking, this must be why the second condition exists --

Composition: F.map(fa, a => bc(ab(a))) = F.map(F.map(fa, ab), bc)

this seems to say that if map is passed a value, "fa", and some function
which takes a value and applies another function ("ab") first,
and then applies another function ("bc"), then the result has to be the same
as calling map with each of these sequentially.

I guess it's worth pointing out that "ab" and "bc" seem to imply that the functions
must be different. That is, they can't both be the identity function.

let's take these examples as literally as possible:
*/

function appendB(a: string): string {
  return `${a}b`;
}

function appendC(a: string): string {
  return `${a}c`;
}

function appendBC(a: string): string {
  return appendC(appendB(a));
}

// Here I'm cheating a bit, I've used map before, and I know that it's meaning is this.
// I can't imagine how I would _derive_ that the function must be applied to the argument
// just from the Composition requirement alone?
const meetsComp = {
  map: (value: any, fn: (a: any) => any) => {
    return fn(value);
  },
};

// F.map(fa, a => bc(ab(a))) = F.map(F.map(fa, ab), bc)
console.log(`testing composition-test-as-written with meetsIdentity\n`);
r1 = meetsIdentity.map('a', appendBC);
r2 = meetsIdentity.map(meetsIdentity.map('a', appendB), appendC);
console.log(`composition with meetsIdentity: ${r1} ?= ${r2}`);
console.log(`\n\n`);

console.log(`testing identity with meetsComp\n`);
r1 = meetsComp.map('anything', identity);
console.log(`meetsComp.map("anything", identity): ${r1}`);
console.log(`\n\n`);

console.log(`testing composition-test-as-written with meetsComp\n`);
r1 = meetsComp.map('a', appendBC);
r2 = meetsComp.map(meetsComp.map('a', appendB), appendC);
console.log(`composition with meetsComp: ${r1} ?= ${r2}`);
console.log(`\n\n`);

/**

This makes me wonder if I've found a shortcoming in the definition
for composition supplied in fp-ts. b/c, _technically_,
meetsIdentity, which completely ignores its function argument,
is fulfilling the requirement of:

F.map(fa, a => bc(ab(a))) = F.map(F.map(fa, ab), bc)

should this requirement actually be written as?

(a => bc(ab(a))))(fa) = F.map(F.map(fa, ab), bc)

*/

// (a => bc(ab(a))))(fa) = F.map(F.map(fa, ab), bc)
console.log(`testing composition variation with meetsIdentity\n`);
r1 = appendBC('a');
r2 = meetsIdentity.map(meetsIdentity.map('a', appendB), appendC);
console.log(`composition with meetsIdentity: ${r1} ?= ${r2}`);
console.log(`\n\n`);

console.log(`testing composition variation with meetsComp\n`);
r1 = appendBC('a');
r2 = meetsComp.map(meetsComp.map('a', appendB), appendC);
console.log(`composition with meetsComp: ${r1} ?= ${r2}`);
console.log(`\n\n`);
