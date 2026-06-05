import { describe, it, expect } from "vitest";
import { hoistSystemMessagesToClaudeSystem } from "../../open-sse/translator/helpers/claudeHelper.js";

describe("hoistSystemMessagesToClaudeSystem", () => {
  it("removes role system/developer from messages and appends to top-level system", () => {
    const body = {
      system: [{ type: "text", text: "base" }],
      messages: [
        { role: "system", content: "rule A" },
        { role: "developer", content: "rule B" },
        { role: "user", content: [{ type: "text", text: "hello" }] },
      ],
    };

    hoistSystemMessagesToClaudeSystem(body);

    expect(body.messages).toHaveLength(1);
    expect(body.messages[0].role).toBe("user");
    expect(body.system).toEqual([
      { type: "text", text: "base" },
      { type: "text", text: "rule A\nrule B" },
    ]);
  });
});
