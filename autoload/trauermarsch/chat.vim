function! trauermarsch#chat#template(provider) abort
  call denops#request("trauermarsch", "template", [bufnr() + 0, a:provider])
endfunction

function! trauermarsch#chat#chat() abort
  call denops#request("trauermarsch", "chat", [bufnr() + 0])
endfunction
