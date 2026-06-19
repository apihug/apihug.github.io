"use client";
import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { CodeCopyButton } from '@/components/CodeCopyButton'

const frameColors = {
  sky: 'from-sky-500 to-cyan-300',
  indigo: 'from-indigo-500 to-blue-400',
  pink: 'from-pink-500 to-fuchsia-400',
  fuchsia: 'from-fuchsia-500 to-purple-400',
  purple: 'from-violet-500 to-purple-500',
}

/**
 * @typedef {React.ReactElement<{ filename?: string }>} CodeBlock
 */

/**
 * Represents a styled tab in a snippet group that adjusts its style
 * based on the position of this tab relative to the selected tab(s)
 *
 * Also supports an optional marker icon (close or modified)
 *
 * @param {object} props
 * @param {ReactElement[]} props.children
 * @param {number} props.selectedIndex
 * @param {number} props.myIndex
 * @param {"close" | "modified"} [props.marker]
 */
function TabItem({ children, selectedIndex, myIndex, marker }) {
  const isSelected = selectedIndex === myIndex

  return (
    <Tab
      className={clsx(
        'relative rounded-md px-2 py-1 transition [&:not(:focus-visible)]:focus:outline-none',
        isSelected ? 'bg-white/5 text-slate-100' : 'text-slate-400 hover:text-slate-200'
      )}
    >
      <span className="truncate">{children}</span>

      {marker === 'close' && (
        <svg viewBox="0 0 4 4" className="ml-2.5 inline h-1 w-1 overflow-visible text-slate-500">
          <path d="M-1 -1L5 5M5 -1L-1 5" fill="none" stroke="currentColor" strokeLinecap="round" />
        </svg>
      )}

      {marker === 'modified' && <span className="ml-2.5 inline-block h-1 w-1 rounded-full bg-current" />}
    </Tab>
  )
}

let snippetGroupWrappers = {
  plain({ children }) {
    return (
      <div className="not-prose overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950 shadow-sm shadow-slate-950/20">
        {children}
      </div>
    )
  },
  framed({ children, className, color = 'sky' }) {
    return (
      <div
        className={clsx(
          className,
          frameColors[color],
          'relative -mx-4 bg-gradient-to-b pt-6 pl-4 sm:mx-0 sm:rounded-2xl sm:pt-12 sm:pl-12'
        )}
      >
        <div className="not-prose overflow-hidden rounded-tl-xl border border-slate-800/80 bg-slate-950 shadow-sm shadow-slate-950/20">
          {children}
        </div>
      </div>
    )
  },
}

/**
 * Group multiple code blocks into a tabbed UI
 *
 * @param {object} props
 * @param {CodeBlock[]} props.children
 */
export function SnippetGroup({ children, style = 'plain', actions, ...props }) {
  let [selectedIndex, setSelectedIndex] = useState(0)
  let tabs = React.Children.toArray(children).filter(React.isValidElement)
  let activeCode = tabs[selectedIndex]?.props.code
  let activeLabel = tabs[selectedIndex]?.props.filename || 'Code'

  let Wrapper = snippetGroupWrappers[style]

  return (
    <Wrapper {...props}>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-2 py-2">
          <Tab.List className="flex min-w-0 items-center gap-1 text-[0.6875rem] font-medium tracking-wide text-slate-400">
            {tabs.map((child, tabIndex) => (
              <TabItem key={child.props.filename} myIndex={tabIndex} selectedIndex={selectedIndex}>
                {child.props.filename}
              </TabItem>
            ))}
          </Tab.List>
          <div className="ml-3 flex flex-none items-center">
            {actions ? actions({ selectedIndex }) : activeCode ? <CodeCopyButton value={activeCode} /> : null}
          </div>
        </div>
        <div className="sr-only" aria-live="polite">{activeLabel}</div>
        <Tab.Panels className="flex overflow-x-auto bg-slate-900/95">
          {tabs.map((child) => (
            <Tab.Panel
              key={child.props.filename}
              className="flex-none min-w-full px-4 py-4 text-[13px] leading-6 text-slate-50 ligatures-none"
            >
              {child.props.children}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </Wrapper>
  )
}
