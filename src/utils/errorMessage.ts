import { getFormattedDate } from "./dateUtil";

export const generateErrorMessage = (
  functionName: string,
  details: Record<string, string>,
  error: unknown
): string => {
  const detailsFormatted = Object.entries(details)
    .map(([key, value]) => `**${key}:** \`${value}\``)
    .join("\n");
  return `
**❌ Failed to Retrieve Information**

**Function:** \`${functionName}\`
${detailsFormatted}  

**Date:** \`${getFormattedDate()}\`  

**Trace:**  
\`\`\`js
${(error as any).stack}
\`\`\`
`;
};
