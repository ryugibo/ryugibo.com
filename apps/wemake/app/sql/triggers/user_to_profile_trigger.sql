create or replace function wemake.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.raw_app_meta_data is not null then
        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'email' then
            if new.raw_user_meta_data ? 'name' AND new.raw_user_meta_data ? 'username' then
                insert into wemake.profiles (id, name, username, role)
                values (new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'username', 'developer');
            else
                insert into wemake.profiles (id, name, username, role)
                values (new.id, 'Anonymous', 'mr.' || substr(md5(random()::text), 1, 8), 'developer');
            end if;
        end if;
    end if;
    return new;
end;
$$;

create or replace trigger user_to_profile_trigger
after insert on auth.users
for each row execute function wemake.handle_new_user();
