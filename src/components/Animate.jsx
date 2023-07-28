/* eslint-disable react/prop-types */
import { Animation } from "rsuite";

export default function Animate({ children, inn, ...rest }) {
  const Component = children;

  const innn = typeof inn === "boolean" ? inn : true;

  return (
    <Animation.Bounce in={innn} unmountOnExit timeout={5000}>
      {(props, ref) => <Component {...props} {...rest} ref={ref} />}
    </Animation.Bounce>
  );
}
