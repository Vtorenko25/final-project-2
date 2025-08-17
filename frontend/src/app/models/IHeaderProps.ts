export interface HeaderProps {
    sortColumn: string;
    sortOrder: "asc" | "desc";
    onSortChange: (column: string, order: "asc" | "desc") => void;
}