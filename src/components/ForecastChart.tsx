"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { ForecastPoint } from "@/types";

export default function ForecastChart({ data }: { data: ForecastPoint[] }) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#202C3C" vertical={false} />
          <XAxis dataKey="label" stroke="#8CA0B3" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#8CA0B3" fontSize={12} tickLine={false} axisLine={false} unit="°" />
          <Tooltip
            contentStyle={{ background: "#17212F", border: "1px solid #324156", borderRadius: 12 }}
            labelStyle={{ color: "#EAF0F6" }}
            itemStyle={{ color: "#FFB454" }}
          />
          <Line type="monotone" dataKey="temp" stroke="#FFB454" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
