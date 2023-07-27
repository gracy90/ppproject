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

const ReportViewComponent = React.forwardRef((props, ref) => {
  const location = useLocation();
  const toaster = useToaster();

  const message = (
    <Message showIcon type={"success"} closable>
      Generating Report PDF
    </Message>
  );

  const onPrint = () => {
    print(<PDF data={location.state?.data} />, () =>
      toaster.push(message, { placement: "topEnd", duration: 5000 })
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
            />
            <Button
              color="blue"
              appearance="primary"
              startIcon={<Icon as={AiOutlineFilePdf} size="1rem" />}
              onClick={onPrint}
            >
              Export
            </Button>
          </Stack>
        </Stack>
      }
    >
      <FlexboxGrid justify="center">
        <CustomTable data={location.state?.data} />
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
