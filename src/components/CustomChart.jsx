/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader } from "rsuite";
import moment from "moment";

export default function CustomChart({ data }) {
  const [loading, setLoading] = useState(false);
  const [dataToRender, setDataToRender] = useState([]);
  useEffect(() => {
    setLoading(true);
    setDataToRender(
      data?.map((d) => ({
        ...d,
        timestamp: moment(d.timestamp).format("MMMM Do YYYY, h:mm:ss a"),
      }))
    );
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [data]);

  return loading ? (
    <div style={{ height: "450px" }}>
      <Loader
        backdrop
        content="loading Image Detection Models ..."
        vertical
        size="lg"
      />
    </div>
  ) : (
    <ResponsiveContainer aspect={2 / 1}>
      <LineChart
        width={500}
        height={300}
        data={dataToRender}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Decibels"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
