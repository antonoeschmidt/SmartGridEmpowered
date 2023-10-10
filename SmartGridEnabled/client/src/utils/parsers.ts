export const dateFormatter = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("da-DK")} at ${date.toLocaleTimeString("da-DK")}`;
};
