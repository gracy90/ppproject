/* eslint-disable react/no-unknown-property */
/* eslint-disable no-undef */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/display-name */
import React from "react";
import { Panel, FlexboxGrid, DateRangePicker, Stack, Button } from "rsuite";
import { AiOutlineFilePdf } from "react-icons/ai";
import { Icon } from "@rsuite/icons";
import { Message, useToaster } from "rsuite";

import Animate from "../components/Animate";
import CustomTable from "../components/CustomTable";
import { print } from "../services/printService";
import PDF from "../components/Pdf";
import { useLocation } from "react-router-dom";
import moment from "moment";

const ReportViewComponent = React.forwardRef((props, ref) => {
  const location = useLocation();
  const toaster = useToaster();
  const [data, setData] = React.useState([]);
  const [dataToRender, setDataToRender] = React.useState([]);
  const [dataToRenderNew, setDataToRenderNew] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const message = (
    <Message showIcon type={"success"} closable>
      Generating Report PDF
    </Message>
  );

  React.useEffect(() => {
    setData(location.state?.data);
  }, [location.state?.data]);

  React.useEffect(() => {
    setDataToRender(
      (dataToRenderNew || data)?.map((d, i) => ({
        ...d,
        timestamp: moment(d.timestamp).format("MMMM Do YYYY, h:mm:ss a"),
        id: i + 1,
        remark: d.Decibels >= 80 ? "Loud" : d.Decibels <= "Low" ? "Low" : "Low",
      }))
    );
  }, [data, dataToRenderNew]);

  const onPrint = () => {
    setLoading(true);
    print(
      <PDF data={dataToRender} />,
      () => toaster.push(message, { placement: "topEnd", duration: 5000 }),
      () => setLoading(false)
    );
  };

  const handleDataChange = (value) => {
    const from = new Date(value[0]).valueOf();
    const to = new Date(value[1]).valueOf();
    setDataToRenderNew(
      data.filter((d) => d.timestamp >= from && d.timestamp <= to)
    );
  };

  return (
    <Panel
      {...props}
      ref={ref}
      header={
        <Stack justifyContent="space-between">
          <h3>Report For date</h3>
          <Stack spacing={16}>
            <h5>Select Data</h5>
            <DateRangePicker
              format="yyyy-MM-dd HH:mm:ss"
              defaultCalendarValue={[new Date(), new Date()]}
              onChange={handleDataChange}
            />
            <Button
              color="blue"
              appearance="primary"
              startIcon={<Icon as={AiOutlineFilePdf} size="1rem" />}
              onClick={onPrint}
              loading={loading}
            >
              Export
            </Button>
          </Stack>
        </Stack>
      }
    >
      <FlexboxGrid justify="center">
        <CustomTable data={dataToRender} />
      </FlexboxGrid>
    </Panel>
  );
});

export default function ReportView() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={18}>
          <Animate children={ReportViewComponent} />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
}
