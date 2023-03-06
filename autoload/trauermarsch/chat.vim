function! trauermarsch#chat#template(provider) abort
  return denops#request("trauermarsch", "template", [bufnr() + 0, a:provider])
endfunction

function! trauermarsch#chat#chat() abort
  return denops#request("trauermarsch", "chat", [bufnr() + 0])
endfunction
