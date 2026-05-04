export interface SmsPlanRow {
  messages: string;
  price: string;
  originalPrice?: string; // For discounts
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
    const [messages = "", price = "", feature = "", description = "", featured = "false", custom = "false", originalPrice = ""] = line.split("|");
    return {
      messages,
      price,
      originalPrice,
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
    const orig = row.originalPrice || "";
    return `${messages}|${price}|${row.feature}|${row.description}|${row.featured}|${row.custom}|${orig}`;
  })
  .join("\n");
