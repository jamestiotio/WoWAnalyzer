import React from 'react';

type Props = Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'xmlns' | 'version' | 'viewBox' | 'className'
>;

const icon = (props: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="16 16 32 32"
    className="icon"
    {...props}
  >
    <polygon points="40.128,30.517 43.92,31.535 48.567,26.883 47.893,24.366 44.461,27.802 40.628,26.774 39.601,22.935 43.032,19.499 40.519,18.825 35.873,23.477 36.889,27.275 33.991,30.177 27.422,23.6 29.315,21.705 34.293,19.143 26.654,19.04 24.761,20.935 24.04,20.213 21.065,23.192 21.786,23.914 19.668,26.035 17.91,26.531 15.656,28.788 19.613,32.749 21.866,30.493 22.362,28.733 22.329,28.7 24.448,26.579 31.016,33.155 28.23,35.945 24.437,34.927 19.791,39.579 20.465,42.096 23.896,38.66 27.73,39.689 28.757,43.527 25.325,46.963 27.838,47.637 32.485,42.985 31.468,39.187 34.254,36.398 42.875,45.03 45.85,42.051 37.229,33.419" />
  </svg>
);
export default icon;