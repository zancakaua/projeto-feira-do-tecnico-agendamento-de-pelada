-- Funções de gatilho não devem ser chamáveis pela API
revoke execute on function public.matches_after_update() from public, anon, authenticated;
revoke execute on function public.matches_guard() from public, anon, authenticated;
