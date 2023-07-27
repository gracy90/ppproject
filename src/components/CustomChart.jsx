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

// const data = [
//   {
//     name: "Page A",
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     pv: 4300,
//     amt: 2100,
//   },
// ];

export default function CustomChart({ data }) {
  const [loading, setLoading] = useState(false);
  //   const demoUrl =s 'https://codesandbox.io/s/simple-line-chart-kec3v';

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
        data={data}
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
