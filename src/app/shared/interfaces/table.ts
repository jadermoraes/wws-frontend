import { TemplateRef } from "@angular/core";

export interface TableHeader {
    key: string; // The key in the data object this column corresponds to.
    displayName: string; // The display name for the column.
    sortable?: boolean; // Whether the column can be sorted.
    filterable?: boolean; // Whether the column can be filtered.
    type?: 'text' | 'number' | 'date' | 'custom'; // The type of data in the column.
    width?: string; // Width of the column (e.g., '150px', '20%').
    align?: 'left' | 'center' | 'right'; // Text alignment for the column.
    customTemplates?: any; // Reference to a custom template for cell rendering.
    tooltip?: string; // Optional tooltip text for the header.
    hidden?: boolean; // Whether the column is hidden.
  }
  