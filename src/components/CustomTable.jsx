/* eslint-disable react/prop-types */
import React from "react";
import { Pagination, Table } from "rsuite";
import { styled } from "styled-components";

const { Column, HeaderCell, Cell } = Table;

export default function CustomTable({ data }) {
  const [limit, setLimit] = React.useState(20);
  const [page, setPage] = React.useState(1);
  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const newData = data?.map((d, i) => ({
    ...d,
    id: i,
    remark: d.Decibels >= 80 ? "Faild" : d.Decibels <= 50 ? "Nice" : "Good",
  }));

  const dataToRender = newData.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  return (
    <TableWrapper>
      <Table height={560} data={dataToRender} width={800}>
        <Column width={50} align="center" resizable>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell>timestamp</HeaderCell>
          <Cell dataKey="timestamp" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell>Decibels</HeaderCell>
          <Cell dataKey="Decibels" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell>Remarks</HeaderCell>
          <Cell dataKey="remark" />
        </Column>
      </Table>
      <div style={{ padding: 20, width: "100%" }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["total", "-", "limit", "|", "pager", "skip"]}
          total={data.length}
          limitOptions={[20, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
