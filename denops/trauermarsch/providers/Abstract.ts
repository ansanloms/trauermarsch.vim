export type ChatBlock = { role: string; content: string };
export type ChatContents = {
  meta:
    & Record<"provider", typeof Provider.provider>
    & Record<string, string | undefined>;
  blocks: ChatBlock[];
};

export abstract class Provider {
  static readonly provider: string;

  /**
   * コンストラクタ。
   */
  constructor() {
  }

  protected format(block: ChatBlock): string[] {
    return [`${block.role}`, "---", "", ...block.content.split("\n"), ""];
  }

  /**
   * チャットバッファのテンプレートを作成する。
   */
  public abstract template(): string[];

  /**
   * チャットの結果を返却する。
   */
  public abstract chat(content: ChatContents): Promise<ChatBlock[]>;

  /**
   * チャットの結果を追記する。
   */
  public abstract append(blocks: ChatBlock[]): string[];
}
