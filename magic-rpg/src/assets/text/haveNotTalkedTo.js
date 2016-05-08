export default function(context, options) {
  if (!context.state.hasTalkedTo(context.object)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}
