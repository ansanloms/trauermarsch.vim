import type { Denops } from "./deps/denops_std/mod.ts";
import * as autocmd from "./deps/denops_std/autocmd/mod.ts";
import * as helper from "./deps/denops_std/helper/mod.ts";
import { assertNumber } from "./deps/unknownutil/mod.ts";
import { assertProvider, configFilePath, getProvider, parse } from "./utils.ts";

export async function main(denops: Denops) {
  const bufload = async (bufnr: number) => {
    if (await denops.call("bufexists", bufnr)) {
      await denops.call("bufload", bufnr);
    } else {
      throw new Error(`Buffer: ${bufnr} does not exists.`);
    }
  };

  denops.dispatcher = {
    config: async () => {
      return configFilePath;
    },

    template: async (bufnr: unknown, providerName: unknown) => {
      assertNumber(bufnr);
      assertProvider(providerName);

      await bufload(bufnr);

      const provider = getProvider(providerName);

      await denops.call("deletebufline", bufnr, 1, "$");
      await denops.call(
        "appendbufline",
        bufnr,
        0,
        provider.template(),
      );
    },

    chat: async (bufnr: unknown) => {
      assertNumber(bufnr);

      await bufload(bufnr);

      const body = (await denops.call("getbufline", bufnr, 0, "$") as string[])
        .join("\n");
      const content = parse(body);

      assertProvider(content.meta.provider);
      const provider = getProvider(content.meta.provider);
      const blocks = await provider.chat(content);

      await helper.echo(denops, "loading...");

      await denops.call("appendbufline", bufnr, "$", [
        ...provider.append(blocks),
      ]);

      await denops.cmd("redraw");
      await denops.cmd("$");

      await helper.echo(denops, "");
    },
  };
}
