import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
 
// If you're using Next.js please use the dynamic import for react-apexcharts and remove the import from the top for the react-apexcharts
// import dynamic from "next/dynamic";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
 
const chartConfig = {
  type: "line",
  height: 240,
  series: [
    {
      name: "Sales",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#FCF671"],
    stroke: {
      lineCap: "round",
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  },
};
 
export function LightHistory() {
  return (
    <Card>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
            {/* Icon here */}
        </div>
        <div className="flex col-span-12 justify-between w-full">
            <div className="w-fit">
                <Typography variant="h6" color="blue-gray">
                    Ánh sáng
                </Typography>
                <Typography
                    variant="small"
                    color="gray"
                    className="max-w-sm font-normal"
                >
                    Ánh sáng khuyến nghị: XX
                </Typography>
            </div>
            <div className="flex items-center">
                <Typography variant="h6" color="blue-gray">
                    Ngày
                </Typography>
                <input type="date" className="px-2"></input>
            </div>
            <div className="flex items-center">
                <Typography variant="h6" color="blue-gray">
                    Từ
                </Typography>
                <input type="time"  className="px-2"></input>
            </div>
            <div className="flex items-center">
                <Typography variant="h6" color="blue-gray">
                    Đến
                </Typography>
                <input type="time"  className="px-2"></input>
            </div>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}