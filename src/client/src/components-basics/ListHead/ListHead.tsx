import { useTranslation } from "react-i18next";
import "./ListHead.scss";
import { useEffect, useState } from "react";
import { BsArrowDown, BsArrowDownUp } from "react-icons/bs";
import { SortDirection } from "../../components/Users/UsersList/UsersList";

export type ListHeadColumnProps = {
  name: string;
  isSortable?: boolean;
};

type ListHeadProps = {
  columns: ListHeadColumnProps[];
  handleSort: (columnName: string, direction: string) => void;
};

export default function ListHead(props: ListHeadProps) {
  const { t } = useTranslation();
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState(SortDirection.DEFAULT);

  const handleSortColumn = (columnName: string) => {
    let newSortDirection = SortDirection.ASC;
    if (columnName === sortColumn && sortDirection === SortDirection.ASC)
      newSortDirection = SortDirection.DESC;
    else if (sortDirection === SortDirection.DESC)
      newSortDirection = SortDirection.DEFAULT;
    setSortColumn(columnName);
    setSortDirection(newSortDirection);
    props.handleSort(columnName, newSortDirection);
  };

  useEffect(() => {
    if (sortDirection === SortDirection.DESC) {
      document
        .getElementById(`${sortColumn}-sort-icon`)
        ?.classList.add("sort-icon-desc");
    } else {
      document
        .getElementById(`${sortColumn}-sort-icon`)
        ?.classList.remove("sort-icon-desc");
    }
  }, [sortDirection]);

  return (
    <div className="list-header">
      {props.columns.map(column => (
        <p key={column.name} className="list-header-elem">
          {t(`users.${column.name}`)}
          {column.isSortable ? (
            <span
              id={`${column.name}-sort-icon`}
              className="sort-icon"
              onClick={() => handleSortColumn(column.name)}
            >
              {sortColumn === column.name &&
              sortDirection !== SortDirection.DEFAULT ? (
                <BsArrowDown />
              ) : (
                <BsArrowDownUp />
              )}
            </span>
          ) : undefined}
        </p>
      ))}
    </div>
  );
}
