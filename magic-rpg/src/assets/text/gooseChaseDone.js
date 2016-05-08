export default function(context, options) {
  if (context.state.gooseChaseDoneUpTo(context.object)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}
