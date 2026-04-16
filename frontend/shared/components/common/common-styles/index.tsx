// shared/lib/table-styles.ts (or common/styles)

import { TableStyles } from "react-data-table-component";

export const globalTableStyles: TableStyles = {
  table: {
    style: {
      backgroundColor: "var(--card)",
    },
  },
  tableWrapper: {
    style: {
      backgroundColor: "var(--card)",
    },
  },
  responsiveWrapper: {
    style: {
      backgroundColor: "var(--card)",
    },
  },
  headRow: {
    style: {
      minHeight: "3.25rem",
      backgroundColor: "var(--muted)",
      color: "var(--muted-foreground)",
      borderBottomColor: "var(--border)",
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
  },
  headCells: {
    style: {
      paddingLeft: "1rem",
      paddingRight: "1rem",
      fontWeight: 700,
    },
  },
  rows: {
    style: {
      minHeight: "4.5rem",
      backgroundColor: "var(--card)",
      color: "var(--card-foreground)",
      borderBottomColor: "var(--border)",
      transition: "background-color 150ms ease",
    },
    highlightOnHoverStyle: {
      backgroundColor: "color-mix(in srgb, var(--accent) 16%, var(--card))",
      color: "var(--card-foreground)",
      outline: "none",
    },
  },
  cells: {
    style: {
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
  },
  pagination: {
    style: {
      minHeight: "3.75rem",
      backgroundColor: "var(--card)",
      color: "var(--muted-foreground)",
      borderTop: "1px solid var(--border)",
    },
    pageButtonsStyle: {
      borderRadius: "calc(var(--radius) - 2px)",
      height: "2rem",
      width: "2rem",
      padding: 0,
      margin: "0 2px",
      color: "var(--muted-foreground)",
      fill: "var(--muted-foreground)",
      backgroundColor: "transparent",
    },
  },
  noData: {
    style: {
      backgroundColor: "var(--card)",
      color: "var(--muted-foreground)",
    },
  },
  progress: {
    style: {
      backgroundColor: "var(--card)",
      color: "var(--muted-foreground)",
    },
  },
};
