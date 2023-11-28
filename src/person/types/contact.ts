export type Contact = {
    id: number;
    custom_fields_values?: Array<{
      field_id: number;
      values: Array<{
        value: string;
      }>;
    }>;
  };