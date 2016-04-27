export default function(lval, rval, options) {
  if (lval === rval) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}
