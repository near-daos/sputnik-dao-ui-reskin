import React from 'react';
import { compile } from 'path-to-regexp';
import { Route } from 'react-router-dom';
import { Redirect, useLocation } from 'react-router';

// generatePath is planned for next RR release, so we implement here temporarily
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache: any = {};
const generatePath = (
  path: string,
  params: { [x: string]: string | undefined },
) => {
  if (!cache[path]) cache[path] = compile(path);

  return cache[path](params);
};

const RedirectRoute: React.FC<{ to: string; from: string }> = ({
  to,
  from,
}) => {
  const location = useLocation();

  if (!location.hash) return null;

  return (
    <Route
      location={{
        ...location,
        pathname: location.hash.replace('#', ''),
        hash: '',
      }}
      path={from.replace('/#', '')}
      render={(props) => <Redirect to={generatePath(to, props.match.params)} />}
    />
  );
};
export default RedirectRoute;
