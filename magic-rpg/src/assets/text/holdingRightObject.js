export default function(context, options) {
  if (context.state.holdingRightObject(context.object)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}
