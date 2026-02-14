"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

interface ChartData {
  index: number;
  weight: number;
  date: string;
}

interface WeightProgressionChartProps {
  data: ChartData[];
}

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function WeightProgressionChart({ data }: WeightProgressionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Progression</CardTitle>
      </CardHeader>
      <CardContent className="pl-1">
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              width={40}
              domain={["dataMin - 5", "auto"]} 
            />
            <Line
              dataKey="weight"
              type="monotone"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{
                fill: "#ffffff",
                r: 5,
                strokeWidth: 2,
                stroke: "hsl(var(--background))",
              }}
              activeDot={{ r: 7 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
