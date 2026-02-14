"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ children, config, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex aspect-video justify-center text-xs",
      className
    )}
    {...props}
  >
    <RechartsPrimitive.ResponsiveContainer>
      {children}
    </RechartsPrimitive.ResponsiveContainer>
  </div>
))
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean
    payload?: any[]
    className?: string
    indicator?: "line" | "dot" | "dashed"
    hideLabel?: boolean
    hideIndicator?: boolean
    label?: string
    labelFormatter?: (label: any, payload: any) => React.ReactNode
    labelClassName?: string
    formatter?: (value: any, name: any, item: any, index: number) => React.ReactNode
    color?: string
    nameKey?: string
    labelKey?: string
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const context = React.useContext(ChartContext)

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const value =
        label !== undefined
          ? label
          : labelFormatter !== undefined
            ? labelFormatter(item.payload, key)
            : context?.[key]?.label || key

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [label, labelFormatter, payload, hideLabel, labelClassName, context, labelKey])

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!hideLabel && tooltipLabel}
        <div className="grid gap-1.5">
          {payload.map((value: any, index: number) => {
            const key = `${nameKey || value.name || value.dataKey || "value"}`
            const item = {
              value: value.value,
              name:
                formatter !== undefined
                  ? formatter(
                      value.value,
                      key,
                      value.payload,
                      index
                    )
                  : context?.[key]?.label || key,
            }

            const indicatorColor = color || value.payload.fill || value.color

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "[&>svg]:h-2.5 [&>svg]:w-2.5",
                  indicator === "line" && "[&>svg]:h-2.5 [&>svg]:w-8"
                )}
              >
                {!hideIndicator && (
                  <svg
                    viewBox="0 0 32 32"
                    className={cn(
                      "shrink-0 rounded-[2px]",
                      indicator === "dashed"
                        ? "stroke-foreground/50 stroke-[3px]"
                        : "fill-foreground"
                    )}
                  >
                    <rect
                      width={32}
                      height={32}
                      fill={indicatorColor}
                      rx={indicator === "line" ? 2 : 5}
                    />
                  </svg>
                )}
                <div
                  className={cn(
                    "flex flex-1 flex-col gap-0.5 leading-none",
                    hideIndicator && "ml-1.5"
                  )}
                >
                  <span className="font-medium text-muted-foreground">
                    {item.name}
                  </span>
                  <span className="font-bold tabular-nums text-foreground">
                    {item.value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    className?: string
    hideIcon?: boolean
    payload?: any
    verticalAlign?: "top" | "bottom"
    nameKey?: string
  }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const config = React.useContext(ChartContext)

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((entry: any, index: number) => {
          const key = `${nameKey || entry.dataKey || "value"}`
          const item = config?.[key] || {}

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1.5 text-sm",
                !item?.label && "hidden"
              )}
            >
              {item.icon && !hideIcon ? (
                <item.icon className="h-4 w-4" />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: entry.color,
                  }}
                />
              )}
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
    color?: string
    theme?: {
      light?: string
      dark?: string
    }
  }
}

const ChartContext = React.createContext<ChartConfig | null>(null)

export type { ChartConfig }
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartContext,
}
