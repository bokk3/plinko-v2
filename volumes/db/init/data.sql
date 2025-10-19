
-- User profiles table (linked to auth.users)
create table if not exists profiles (
	id uuid references auth.users on delete cascade primary key,
	email text,
	credits integer default 100
);

-- Game results table
create table if not exists games (
	id uuid default gen_random_uuid() primary key,
	user_id uuid references profiles(id),
	result text,
	multiplier numeric,
	created_at timestamptz default now()
);

-- Function to insert profile after user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();