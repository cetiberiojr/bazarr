import React, { useMemo } from "react";
import { Col, Container, Pagination, Row, Table } from "react-bootstrap";
import { TableOptions, usePagination, useTable } from "react-table";

interface Props<T extends object = {}> extends TableOptions<T> {
  emptyText?: string;
  showPageControl?: boolean;
  responsive?: boolean;
  hoverable?: boolean;
  striped?: boolean;
  borderless?: boolean;
  small?: boolean;
  hideHeader?: boolean;
}

export default function BasicTable<T extends object = {}>(props: Props<T>) {
  const {
    emptyText,
    showPageControl,
    responsive,
    hoverable,
    striped,
    borderless,
    small,
    hideHeader,
    ...options
  } = props;

  // Default Settings
  options.autoResetPage = options.autoResetPage ?? false;

  const instance = useTable(options, usePagination);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,

    // page
    page,
    canNextPage,
    canPreviousPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = instance;

  const header = useMemo(
    () => (
      <thead hidden={hideHeader}>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => (
              <th {...col.getHeaderProps()}>{col.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
    ),
    [headerGroups, hideHeader]
  );

  const colCount = useMemo(() => {
    return headerGroups.reduce(
      (prev, curr) => (curr.headers.length > prev ? curr.headers.length : prev),
      0
    );
  }, [headerGroups]);

  const empty = rows.length === 0;

  const body = useMemo(
    () => (
      <tbody {...getTableBodyProps()}>
        {emptyText && empty ? (
          <tr>
            <td colSpan={colCount} className="text-center">
              {emptyText}
            </td>
          </tr>
        ) : (
          page.map(
            (row): JSX.Element => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      className={cell.column.className}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            }
          )
        )}
      </tbody>
    ),
    [colCount, empty, getTableBodyProps, page, prepareRow, emptyText]
  );

  const pageButtons = useMemo(() => {
    return [...Array(pageCount).keys()]
      .map((idx) => {
        if (
          Math.abs(idx - pageIndex) >= 4 &&
          idx !== 0 &&
          idx !== pageCount - 1
        ) {
          return null;
        } else {
          return (
            <Pagination.Item
              key={idx}
              active={pageIndex === idx}
              onClick={() => gotoPage(idx)}
            >
              {idx + 1}
            </Pagination.Item>
          );
        }
      })
      .flatMap((item, idx, arr) => {
        if (item === null) {
          if (arr[idx + 1] === null) {
            return [];
          } else {
            return (
              <Pagination.Ellipsis key={idx} disabled></Pagination.Ellipsis>
            );
          }
        } else {
          return [item];
        }
      });
  }, [pageCount, pageIndex, gotoPage]);

  const pageControl = useMemo(() => {
    const start = empty ? 0 : pageSize * pageIndex + 1;
    const end = Math.min(pageSize * (pageIndex + 1), rows.length);
    const pageControlEnabled = showPageControl ?? true;

    return (
      <Container fluid hidden={!pageControlEnabled}>
        <Row>
          <Col className="d-flex align-items-center justify-content-start">
            <span>
              Show {start} to {end} of {rows.length} entries
            </span>
          </Col>
          <Col className="d-flex justify-content-end">
            <Pagination className="m-0" hidden={pageCount <= 1}>
              <Pagination.Prev
                onClick={previousPage}
                disabled={!canPreviousPage}
              ></Pagination.Prev>
              {pageButtons}
              <Pagination.Next
                onClick={nextPage}
                disabled={!canNextPage}
              ></Pagination.Next>
            </Pagination>
          </Col>
        </Row>
      </Container>
    );
  }, [
    empty,
    pageIndex,
    pageSize,
    previousPage,
    canPreviousPage,
    canNextPage,
    nextPage,
    pageButtons,
    pageCount,
    rows.length,
    showPageControl,
  ]);

  return (
    <React.Fragment>
      <Table
        size={small ? "sm" : undefined}
        striped={striped ?? true}
        borderless={borderless ?? true}
        hover={hoverable}
        responsive={responsive ?? true}
        {...getTableProps()}
      >
        {header}
        {body}
      </Table>
      {pageControl}
    </React.Fragment>
  );
}