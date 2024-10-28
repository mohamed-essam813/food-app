drop policy "Allow authenticated users ALL operations" on "public"."order_items";

drop policy "All authenticated users All operations" on "public"."orders";

drop policy "Allow authenticated users ALL operations" on "public"."products";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

alter table "public"."order_items" alter column "quantity" drop not null;

alter table "public"."orders" alter column "user_id" set default gen_random_uuid();

alter table "public"."products" alter column "price" drop not null;

alter table "public"."profiles" drop column "expo_push_token";

alter table "public"."profiles" drop column "stripe_customer_id";

create policy "Allow authenticated users All operations"
on "public"."order_items"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow authenticated users All operations"
on "public"."orders"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow authenticated users to SELECT"
on "public"."products"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));



