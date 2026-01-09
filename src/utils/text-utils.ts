function capitalizeFirstLetter(word: string) {
  if (typeof word !== "string" || word.length === 0) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export function removeMarkdownTags(text: string) {
  // Remove the starting tag "```markdown" along with any trailing whitespace/newline.
  let cleaned = text.replace(/^```markdown\s*/, "");
  // Remove the trailing "```" along with any preceding whitespace/newline.
  cleaned = cleaned.replace(/\s*```$/, "");
  return cleaned;
}
