import React from "react";

import s from "./Button.module.scss";

interface ButtonProps {
  type: string;
}

const Button: React.FC<ButtonProps> = () => <button className={s.root} />;

export default Button;
