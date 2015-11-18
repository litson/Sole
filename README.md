# Sole
Overrid console.

<img src='http://ww2.sinaimg.cn/large/be899c05jw1ey41reerh1g20pp09ptrc.gif'>


### Features 

Appropriate use of `solejs` in your development version.

And production version remove it, that's simple & no sad effects.

## Usage

```html
<body>
<!-- Snap the body tag. -->
<srcript src='build/sole.js'></script>

<script>

// type your scripts here...

var objectLiteral = {
  foo: {
    name  : 'toby',
    skill : 'html'
  }
}

function bar() {
  return objectLiteral.foo;
}

console.log( 1 );             // output 1.

console.log( objectLiteral ); // output an nested object literal.

console.log( bar );           // ouput function string.

console.log( bar() );         // output executed results.

</script>

</body>

```
