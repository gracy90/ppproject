/* eslint-disable react/prop-types */
import { Animation } from "rsuite";

export default function Animate({ children }) {
  const Component = children;
  return (
    <Animation.Bounce in={true} unmountOnExit timeout={5000}>
      {(props, ref) => <Component {...props} ref={ref} />}
    </Animation.Bounce>
  );
}
