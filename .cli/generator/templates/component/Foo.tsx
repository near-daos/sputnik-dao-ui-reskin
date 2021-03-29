import React from 'react';
import cn from 'classnames';

import s from './<%name%>.module.scss';

export interface <%name%>Props {
  className?: string;
};

const <%name%>: React.FC<<%name%>Props> = ({ className }) => {
  return <div className={cn(s.root, className)}><%name%></div>;
};

export default <%name%>;
