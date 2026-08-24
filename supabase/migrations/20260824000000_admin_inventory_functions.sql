create or replace function public.admin_adjust_stock(
  p_inventory_item_id uuid,
  p_delta numeric
)
returns table (
  old_quantity numeric,
  new_quantity numeric,
  reorder_threshold numeric,
  item_name text,
  item_unit text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_quantity numeric;
  v_new_quantity numeric;
  v_reorder_threshold numeric;
  v_item_name text;
  v_item_unit text;
begin
  select sl.quantity, sl.reorder_threshold, ii.name, ii.unit
    into v_old_quantity, v_reorder_threshold, v_item_name, v_item_unit
  from public.stock_levels sl
  join public.inventory_items ii on ii.id = sl.inventory_item_id
  where sl.inventory_item_id = p_inventory_item_id
  for update;

  if not found then
    raise exception 'Stock row not found for inventory item %', p_inventory_item_id;
  end if;

  v_new_quantity := greatest(0, v_old_quantity + p_delta);

  update public.stock_levels
  set quantity = v_new_quantity,
      updated_at = now()
  where inventory_item_id = p_inventory_item_id;

  return query select
    v_old_quantity,
    v_new_quantity,
    v_reorder_threshold,
    v_item_name,
    v_item_unit;
end;
$$;

create or replace function public.admin_log_usage(
  p_inventory_item_id uuid,
  p_quantity_used numeric,
  p_event_name text
)
returns table (
  old_quantity numeric,
  new_quantity numeric,
  reorder_threshold numeric,
  item_name text,
  item_unit text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usage_log (inventory_item_id, quantity_used, event_name)
  values (p_inventory_item_id, p_quantity_used, p_event_name);

  return query
    select * from public.admin_adjust_stock(p_inventory_item_id, -p_quantity_used);
end;
$$;

create or replace function public.admin_delete_usage_log(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inventory_item_id uuid;
  v_quantity_used numeric;
begin
  select inventory_item_id, quantity_used
    into v_inventory_item_id, v_quantity_used
  from public.usage_log
  where id = p_id
  for update;

  if not found then
    raise exception 'Usage log not found: %', p_id;
  end if;

  delete from public.usage_log where id = p_id;
  perform public.admin_adjust_stock(v_inventory_item_id, v_quantity_used);
end;
$$;

create or replace function public.admin_update_usage_log(
  p_id uuid,
  p_quantity_used numeric,
  p_event_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inventory_item_id uuid;
  v_old_quantity_used numeric;
begin
  select inventory_item_id, quantity_used
    into v_inventory_item_id, v_old_quantity_used
  from public.usage_log
  where id = p_id
  for update;

  if not found then
    raise exception 'Usage log not found: %', p_id;
  end if;

  update public.usage_log
  set quantity_used = p_quantity_used,
      event_name = p_event_name
  where id = p_id;

  perform public.admin_adjust_stock(
    v_inventory_item_id,
    v_old_quantity_used - p_quantity_used
  );
end;
$$;

create or replace function public.admin_log_waste(
  p_inventory_item_id uuid,
  p_quantity numeric,
  p_reason text,
  p_notes text
)
returns table (
  old_quantity numeric,
  new_quantity numeric,
  reorder_threshold numeric,
  item_name text,
  item_unit text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.waste_log (inventory_item_id, quantity, reason, notes)
  values (p_inventory_item_id, p_quantity, p_reason, p_notes);

  return query
    select * from public.admin_adjust_stock(p_inventory_item_id, -p_quantity);
end;
$$;

create or replace function public.admin_delete_waste_log(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inventory_item_id uuid;
  v_quantity numeric;
begin
  select inventory_item_id, quantity
    into v_inventory_item_id, v_quantity
  from public.waste_log
  where id = p_id
  for update;

  if not found then
    raise exception 'Waste log not found: %', p_id;
  end if;

  delete from public.waste_log where id = p_id;
  perform public.admin_adjust_stock(v_inventory_item_id, v_quantity);
end;
$$;

create or replace function public.admin_update_waste_log(
  p_id uuid,
  p_quantity numeric,
  p_reason text,
  p_notes text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inventory_item_id uuid;
  v_old_quantity numeric;
begin
  select inventory_item_id, quantity
    into v_inventory_item_id, v_old_quantity
  from public.waste_log
  where id = p_id
  for update;

  if not found then
    raise exception 'Waste log not found: %', p_id;
  end if;

  update public.waste_log
  set quantity = p_quantity,
      reason = p_reason,
      notes = p_notes
  where id = p_id;

  perform public.admin_adjust_stock(v_inventory_item_id, v_old_quantity - p_quantity);
end;
$$;

create or replace function public.admin_create_purchase_order(
  p_supplier text,
  p_status text,
  p_notes text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total numeric;
  v_item record;
begin
  select coalesce(sum(quantity * unit_cost), 0)
    into v_total
  from jsonb_to_recordset(p_items)
    as item(inventory_item_id uuid, quantity numeric, unit_cost numeric);

  insert into public.purchase_orders (supplier, status, notes, total)
  values (p_supplier, p_status, p_notes, v_total)
  returning id into v_order_id;

  insert into public.purchase_order_items (
    order_id,
    inventory_item_id,
    quantity,
    unit_cost
  )
  select v_order_id, inventory_item_id, quantity, unit_cost
  from jsonb_to_recordset(p_items)
    as item(inventory_item_id uuid, quantity numeric, unit_cost numeric);

  if p_status = 'received' then
    for v_item in
      select inventory_item_id, quantity
      from jsonb_to_recordset(p_items)
        as item(inventory_item_id uuid, quantity numeric, unit_cost numeric)
    loop
      perform public.admin_adjust_stock(v_item.inventory_item_id, v_item.quantity);
    end loop;
  end if;

  return v_order_id;
end;
$$;

create or replace function public.admin_update_purchase_order_status(
  p_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status text;
  v_item record;
begin
  select status
    into v_old_status
  from public.purchase_orders
  where id = p_id
  for update;

  if not found then
    raise exception 'Purchase order not found: %', p_id;
  end if;

  if p_status = 'received' and v_old_status <> 'received' then
    for v_item in
      select inventory_item_id, quantity
      from public.purchase_order_items
      where order_id = p_id
    loop
      perform public.admin_adjust_stock(v_item.inventory_item_id, v_item.quantity);
    end loop;
  end if;

  update public.purchase_orders
  set status = p_status
  where id = p_id;
end;
$$;
