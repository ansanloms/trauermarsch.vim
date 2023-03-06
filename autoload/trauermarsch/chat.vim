function! trauermarsch#chat#template(provider) abort
  call denops#notify("trauermarsch", "template", [bufnr() + 0, a:provider])
endfunction

function! trauermarsch#chat#chat() abort
  call denops#notify("trauermarsch", "chat", [bufnr() + 0])
endfunction
