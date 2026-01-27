CREATE OR REPLACE FUNCTION den.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.raw_app_meta_data is not null then
        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'email' then
            insert into den.profiles (id, name, username)
            values (new.id, 'Anonymous', 'mr.' || substr(md5(random()::text), 1, 8));
        end if;
    end if;
    return new;
end;
$$;

create OR REPLACE TRIGGER user_to_den_profile_trigger
after insert on auth.users
for each row execute function den.handle_new_user();
