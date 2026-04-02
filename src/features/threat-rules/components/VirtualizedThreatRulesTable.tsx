import { useRef } from 'react'
import { flexRender, getCoreRowModel, useReactTable, type Row } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { ThreatRule } from '../types'
import { threatRulesColumns, threatRulesGridTemplateColumns } from './threatRulesColumns'
import { ThreatRuleVirtualRow } from './ThreatRuleVirtualRow'

const ROW_HEIGHT_PX = 44
const VIRTUAL_OVERSCAN = 4

export type VirtualizedThreatRulesTableProps = {
  data: ThreatRule[]
  selectedRuleId: string | null
  onSelectRuleId: (id: string) => void
}

export function VirtualizedThreatRulesTable({
  data,
  selectedRuleId,
  onSelectRuleId,
}: VirtualizedThreatRulesTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  /* TanStack Table's instance exposes mutable row APIs; React Compiler skips memo here — intentional. */
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is stable for interview-style table wiring
  const table = useReactTable({
    data,
    columns: threatRulesColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const rows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: VIRTUAL_OVERSCAN,
    getItemKey: (index) => rows[index]?.id ?? index,
  })

  if (data.length === 0) {
    return (
      <div className="threat-rules-virtual-table threat-rules-virtual-table--empty" role="region" aria-label="Threat rules">
        <p className="threat-rules-virtual-table__empty">
          No rules match your current filters.
        </p>
      </div>
    )
  }

  return (
    <div className="threat-rules-virtual-table" role="region" aria-label="Threat rules">
      <div className="threat-rules-virtual-table__header">
        {table.getHeaderGroups().map((headerGroup) => (
          <div
            key={headerGroup.id}
            className="threat-rules-virtual-table__header-row"
            style={{ gridTemplateColumns: threatRulesGridTemplateColumns }}
          >
            {headerGroup.headers.map((header) => (
              <div key={header.id} className="threat-rules-virtual-table__header-cell">
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={scrollRef} className="threat-rules-virtual-table__scroll" tabIndex={0}>
        <div
          className="threat-rules-virtual-table__virtual-window"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((vRow) => {
            const row = rows[vRow.index] as Row<ThreatRule> | undefined
            if (!row) return null

            return (
              <ThreatRuleVirtualRow
                key={row.id}
                y={vRow.start}
                height={vRow.size}
                row={row}
                isSelected={row.original.id === selectedRuleId}
                onSelectRuleId={onSelectRuleId}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
