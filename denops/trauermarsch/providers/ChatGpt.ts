import { ChatBlock, ChatContents, Provider } from "./Abstract.ts";
import type {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from "../deps/openai/index.ts";

export type Config = {
  token: string;
  system?: string[];
};

export class ChatGpt extends Provider {
  static readonly provider = "chat-gpt";

  private token: string;
  private system: string[];

  constructor(config: Config) {
    super();

    this.token = config.token;
    this.system = config.system || [];
  }

  public template() {
    return [
      "---",
      `provider: ${ChatGpt.provider}`,
      "---",
      "",
    ].concat(
      ...this.system.map((v) => this.format({ role: "system", content: v }))
        .flat(),
      ...this.format({ role: "user", content: "" }),
    );
  }

  public async chat(content: ChatContents) {
    //const openai = new OpenAIApi(new Configuration({ apiKey: this.token }));

    const systemMessages: ChatCompletionRequestMessage[] = content.blocks
      .filter((v) => v.role === "system")
      .map((v) => ({ role: "system", content: v.content }));

    const prevMessages: ChatCompletionRequestMessage[] = content.blocks
      .filter((v) => v.role === "user" || v.role === "assistant")
      .map((v) => ({
        role: v.role as ChatCompletionRequestMessage["role"],
        content: v.content,
      }));

    //const completion = await openai.createChatCompletion({
    //  model: "gpt-3.5-turbo",
    //  messages: [...systemMessages, ...prevMessages ],
    //});

    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [...systemMessages, ...prevMessages],
      }),
    });

    const data = (await result.json()) as CreateChatCompletionResponse;

    const assistantMessages = data.choices.map<ChatBlock>((v) => ({
      role: v.message?.role || "assistant",
      content: v.message?.content || "",
    }));

    return assistantMessages;
  }

  public append(blocks: ChatBlock[]) {
    return blocks.map((block) => this.format(block))
      .flat().concat(...this.format({ role: "user", content: "" }));
  }
}
