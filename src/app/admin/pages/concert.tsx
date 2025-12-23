import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";

export const ConcertList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="title" />
      <DataTable.Col source="holding_time" />
      <DataTable.Col source="cover_urls.horizontal" />
      <DataTable.Col source="is_saved" />
      <DataTable.Col source="venue.title" />
      <DataTable.Col source="created_at" />
      <DataTable.Col source="updated_at" />
    </DataTable>
  </List>
);
