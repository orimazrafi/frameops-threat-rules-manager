import { memo } from 'react'
import { flexRender, type Row } from '@tanstack/react-table'
import type { ThreatRule } from '../types'
import { threatRulesGridTemplateColumns } from './threatRulesColumns'

type ThreatRuleRowContentProps = {
  row: Row<ThreatRule>
}

function rowContentPropsEqual(
  prev: Readonly<ThreatRuleRowContentProps>,
  next: Readonly<ThreatRuleRowContentProps>,
): boolean {
  return prev.row.id === next.row.id && prev.row.original === next.row.original
}

/** Cell rendering only; selection and scroll position live on the outer shell. */
const ThreatRuleRowContent = memo(function ThreatRuleRowContent({ row }: ThreatRuleRowContentProps) {
  return (
    <div
      className="threat-rules-virtual-table__row-grid"
      style={{ gridTemplateColumns: threatRulesGridTemplateColumns }}
    >
      {row.getVisibleCells().map((cell) => (
        <div key={cell.id} className="threat-rules-virtual-table__cell">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  )
}, rowContentPropsEqual)

export type ThreatRuleVirtualRowProps = {
  y: number
  height: number
  row: Row<ThreatRule>
  isSelected: boolean
  onSelectRuleId: (id: string) => void
}

/**
 * Light wrapper: compositor-friendly transform, click target, selection chrome.
 * `ThreatRuleRowContent` is memoized so selection changes do not rerender cells.
 */
export function ThreatRuleVirtualRow({ y, height, row, isSelected, onSelectRuleId }: ThreatRuleVirtualRowProps) {
  return (
    <div
      role="row"
      aria-selected={isSelected}
      className={
        isSelected ? 'threat-rules-virtual-table__row is-selected' : 'threat-rules-virtual-table__row'
      }
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height,
        transform: `translate3d(0, ${y}px, 0)`,
      }}
      onClick={() => onSelectRuleId(row.original.id)}
    >
      <ThreatRuleRowContent row={row} />
    </div>
  )
}
