/* eslint-disable react/prop-types */
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import moment from "moment/moment";

const styles = StyleSheet.create({
  body: {
    padding: 30,
    width: "100%",
  },
  table: {
    display: "table",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#ccc",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    color: "#444",
  },
  header: {
    marginBottom: 20,
    textAlign: "center", // Center the header text
  },
  space: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    gap: 16,
  },
  key: {
    fontSize: 10,
    color: "#444",
    marginRight: 16,
  },
  value: {
    fontSize: 10,
    color: "#313030",
  },
});

export default function PDF({ data }) {
  const newData = data?.map((d, i) => ({
    ...d,
    id: i,
    remark: d.Decibels >= 80 ? "Faild" : d.Decibels <= 50 ? "Nice" : "Good",
  }));

  console.log(data);

  return (
    <Document>
      <Page style={styles.body} size="A4">
        <View style={styles.header}>
          <Text style={styles.headerText}>Report Overview</Text>
          <Text style={styles.space}>
            <Text style={styles.key}>Date &nbsp;&nbsp;</Text>
            <Text style={styles.value}>
              {moment(Date.now()).format("MMM Do YY")}
            </Text>
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>ID</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>DATE</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>VALUE</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>REMARKS</Text>
            </View>
          </View>
          {newData.map((row) => (
            <View key={row.id} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.id}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.timestamp}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.Decibels}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.remark}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
