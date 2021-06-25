export function renderTextWithUrl(text: string): string {
  const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;

  return text.replace(reg, "<a href='$1$2'>$1$2</a>");
}
