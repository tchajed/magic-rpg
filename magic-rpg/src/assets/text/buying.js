export default function(context, options) {
  let resource = context.obj.props.resource;
  if (!context.state.sourced[resource]) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}
