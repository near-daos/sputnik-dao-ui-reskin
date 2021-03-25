function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function camelize(string, pascal = true) {
  const camelizeString = string.replace(
    /^([A-Z])|[\s-_]+(\w)/g,
    (_, p1, p2) => {
      return p2 ? p2.toUpperCase() : p1.toLowerCase();
    },
  );

  if (pascal) {
    return capitalize(camelizeString);
  }

  return camelizeString;
}

const templateEngine = (tpl, data) => {
  const re = /<%([^%>]+)?%>/g;
  let match;

  while ((match = re.exec(tpl))) {
    tpl = tpl.replace(match[0], data[match[1]]);
  }

  return tpl;
};

module.exports = {
  templateEngine,
  camelize,
};
