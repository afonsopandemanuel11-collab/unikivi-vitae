"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

type MonthlyDataPoint = {
  label: string;
  users: number;
  publications: number;
};

export default function DashboardChart({
  initialData,
}: {
  initialData: MonthlyDataPoint[];
}) {
  const [period, setPeriod] = useState<"month" | "year">("month");

  // Multiplicadores para simulação de visão anual vs mensal
  const chartData =
    period === "month"
      ? initialData
      : [
          { label: "2021", users: 320, publications: 110 },
          { label: "2022", users: 580, publications: 210 },
          { label: "2023", users: 890, publications: 320 },
          { label: "2024", users: 1248, publications: 381 },
        ];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-headline-md text-lg font-bold text-primary">
            Crescimento de Utilizadores
          </h3>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            Registo de utilizadores e novas publicações científicas
          </p>
        </div>

        {/* Period toggles */}
        <div className="flex items-center gap-1.5 rounded-full border border-outline-variant/50 bg-surface-container-low p-1">
          <button
            type="button"
            onClick={() => setPeriod("month")}
            className={`rounded-full px-3 py-1 font-label-sm text-xs font-semibold transition-all ${
              period === "month"
                ? "bg-white text-primary shadow-sm"
                : "text-outline hover:text-primary"
            }`}
          >
            Mês
          </button>
          <button
            type="button"
            onClick={() => setPeriod("year")}
            className={`rounded-full px-3 py-1 font-label-sm text-xs font-semibold transition-all ${
              period === "year"
                ? "bg-white text-primary shadow-sm"
                : "text-outline hover:text-primary"
            }`}
          >
            Ano
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00113a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00113a" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#e1e3e4" vertical={false} />

            <XAxis
              dataKey="label"
              stroke="#757682"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#e1e3e4" }}
              dy={5}
            />
            <YAxis
              stroke="#757682"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />

            <Tooltip
              content={({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number }>; label?: string }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-outline-variant/60 bg-white p-3 shadow-lg">
                      <p className="font-headline-md text-xs font-bold text-primary">{label}</p>
                      <div className="mt-1.5 space-y-1 text-xs">
                        <p className="flex items-center gap-2 text-primary font-semibold">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          Novos Utilizadores: {payload[0]?.value}
                        </p>
                        {payload[1] && (
                          <p className="flex items-center gap-2 text-secondary font-semibold">
                            <span className="h-2 w-2 rounded-full bg-secondary-container" />
                            Publicações: {payload[1]?.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
            />

            <Bar
              dataKey="publications"
              name="Publicações"
              fill="#00eefc"
              opacity={0.7}
              radius={[4, 4, 0, 0]}
              barSize={24}
            />

            <Area
              type="monotone"
              dataKey="users"
              name="Novos Utilizadores"
              stroke="#00113a"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#userGrowthGradient)"
              dot={{ r: 4, fill: "#ffffff", stroke: "#00113a", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#00eefc", stroke: "#00113a", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
