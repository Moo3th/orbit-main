export interface SmsPlanRow {
  messages: string;
  price: string;
  feature: string;
  description: string;
  featured: boolean;
  custom: boolean;
}

export const parseSmsPlanRows = (value: string): SmsPlanRow[] => value
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [messages = "", price = "", feature = "", description = "", featured = "false", custom = "false"] = line.split("|");
    return {
      messages,
      price,
      feature,
      description,
      featured: featured.trim().toLowerCase() === "true",
      custom: custom.trim().toLowerCase() === "true" || messages.trim().toLowerCase() === "custom",
    };
  });

export const stringifySmsPlanRows = (rows: SmsPlanRow[]): string => rows
  .map((row) => {
    const messages = row.custom ? "custom" : row.messages;
    const price = row.custom ? "" : row.price;
    return `${messages}|${price}|${row.feature}|${row.description}|${row.featured}|${row.custom}`;
  })
  .join("\n");
