function! trauermarsch#config#get() abort
  return denops#request("trauermarsch", "config", [])
endfunction

function! trauermarsch#config#open() abort
  execute "edit " . trauermarsch#config#get()
endfunction
