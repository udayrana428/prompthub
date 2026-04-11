declare module "react-data-table-component-extensions" {
  import type { ComponentType, ReactNode } from "react";

  export interface DataTableExtensionsProps {
    columns: unknown[];
    data: unknown[];
    filter?: boolean;
    filterPlaceholder?: string;
    export?: boolean;
    exportHeaders?: boolean;
    print?: boolean;
    fileName?: string;
    children?: ReactNode;
  }

  const DataTableExtensions: ComponentType<DataTableExtensionsProps>;
  export default DataTableExtensions;
}
