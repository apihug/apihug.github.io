"use client";

import { useState } from "react";
import clsx from "clsx";
import GridContainer from "../grid-container";
import { Editor } from "./editor";
import LinkButton from "./link-button";
import CategoryHeader from "./category-header";

const SYMBOL = { color: "var(--color-slate-400)" };
const KEYWORD = { color: "var(--color-slate-300)" };
const STRING = { color: "var(--color-sky-300)" };
const TYPE = { color: "var(--color-emerald-400)" };
const ANNOTATION = { color: "var(--color-amber-400)" };
const COMMENT = { color: "var(--color-slate-500)" };
const TAG = { color: "var(--color-pink-400)" };
const ATTR = { color: "var(--color-sky-300)" };

type TabKey = "proto" | "liquibase" | "entity";

const TABS: Record<TabKey, { label: string; description: string }> = {
  proto: {
    label: "entity.proto",
    description: "Column types, lengths, constraints, and table wiring — declared directly in protobuf.",
  },
  liquibase: {
    label: "changelog.xml",
    description: "Liquibase migration changelogs auto-generated from your entities. No manual DDL.",
  },
  entity: {
    label: "Movie.java",
    description: "JPA entities with annotations, relationships, and audit fields — generated from your proto.",
  },
};

export default function EntityDesignSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("proto");

  return (
    <div className="relative max-w-full">
      <GridContainer className="2xl:before:hidden 2xl:after:hidden">
        <CategoryHeader className="text-emerald-500 dark:text-emerald-400">Entity Design</CategoryHeader>
      </GridContainer>

      <GridContainer>
        <h2 className="max-w-lg px-2 text-[2.5rem]/10 font-medium tracking-tighter text-balance max-sm:px-4 2xl:mt-0">
          From proto to database, automatically.
        </h2>
      </GridContainer>

      <GridContainer className="mt-4">
        <p className="max-w-(--breakpoint-md) px-2 text-base/7 text-gray-600 max-sm:px-4 dark:text-gray-400">
          Define your domain model in protobuf. ApiHug generates entities, migrations, and CRUD — schema, code, and API always in sync.
        </p>
      </GridContainer>

      <GridContainer className="mt-16">
        <div className="grid grid-cols-1 gap-8 px-2 max-sm:px-4 lg:grid-cols-5">
          {/* Tabs */}
          <div className="flex flex-col gap-1 lg:col-span-2">
            {(Object.keys(TABS) as TabKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={clsx(
                  "flex flex-col items-start gap-1 rounded-xl px-4 py-3 text-left transition-colors",
                  activeTab === key
                    ? "bg-gray-950/5 dark:bg-white/8"
                    : "hover:bg-gray-950/3 dark:hover:bg-white/4",
                )}
              >
                <span
                  className={clsx(
                    "font-mono text-sm font-semibold",
                    activeTab === key ? "text-sky-500 dark:text-sky-400" : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {TABS[key].label}
                </span>
                <span className="text-xs/5 text-gray-500 dark:text-gray-400">{TABS[key].description}</span>
              </button>
            ))}
            <div className="mt-4">
              <LinkButton href="/docs/protobuf/proto-entity">Learn more</LinkButton>
            </div>
          </div>

          {/* Code — all blocks stacked, only active one visible. Prevents layout shift on tab switch */}
          <div className="relative h-[38rem] lg:col-span-3">
            <div className={clsx("absolute inset-0", activeTab !== "proto" && "invisible")}>
              <ProtoCode />
            </div>
            <div className={clsx("absolute inset-0", activeTab !== "liquibase" && "invisible")}>
              <LiquibaseCode />
            </div>
            <div className={clsx("absolute inset-0", activeTab !== "entity" && "invisible")}>
              <EntityCode />
            </div>
          </div>
        </div>
      </GridContainer>
    </div>
  );
}

function ProtoCode() {
  return (
    <Editor>
      <div
        className={clsx(
          "*:flex *:*:max-w-none *:*:shrink-0 *:*:grow *:overflow-auto *:rounded-lg *:bg-white/10! *:p-5 dark:*:bg-white/5!",
          "**:[.line]:isolate **:[.line]:block **:[.line]:not-last:min-h-[1lh]",
          "*:inset-ring *:inset-ring-white/10 dark:*:inset-ring-white/5",
        )}
      >
        <pre tabIndex={0}>
          <code>
            <code>
              <span className="line">
                <span style={KEYWORD}>message</span>
                <span style={TYPE}> Movie </span>
                <span style={SYMBOL}>&#123;</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>string</span>
                <span style={SYMBOL}> name = </span>
                <span style={ANNOTATION}>1</span>
                <span style={SYMBOL}> [(</span>
                <span style={ANNOTATION}>hope.persistence.column</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>name</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;NAME&quot;</span>
                <span style={SYMBOL}>,</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>description</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;Name of the movie&quot;</span>
                <span style={SYMBOL}>,</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>type</span>
                <span style={SYMBOL}>: </span>
                <span style={TYPE}>VARCHAR</span>
                <span style={SYMBOL}>, </span>
                <span style={KEYWORD}>length</span>
                <span style={SYMBOL}>: &#123; </span>
                <span style={KEYWORD}>value</span>
                <span style={SYMBOL}>: </span>
                <span style={ANNOTATION}>64</span>
                <span style={SYMBOL}> &#125;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={SYMBOL}>&#125;];</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>string</span>
                <span style={SYMBOL}> description = </span>
                <span style={ANNOTATION}>2</span>
                <span style={SYMBOL}> [(</span>
                <span style={ANNOTATION}>hope.persistence.column</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>name</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;DESCRIPTION&quot;</span>
                <span style={SYMBOL}>,</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>type</span>
                <span style={SYMBOL}>: </span>
                <span style={TYPE}>VARCHAR</span>
                <span style={SYMBOL}>, </span>
                <span style={KEYWORD}>length</span>
                <span style={SYMBOL}>: &#123; </span>
                <span style={KEYWORD}>value</span>
                <span style={SYMBOL}>: </span>
                <span style={ANNOTATION}>255</span>
                <span style={SYMBOL}> &#125;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={SYMBOL}>&#125;];</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>MovieLevel</span>
                <span style={SYMBOL}> level = </span>
                <span style={ANNOTATION}>3</span>
                <span style={SYMBOL}> [(</span>
                <span style={ANNOTATION}>hope.persistence.column</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>enum_type</span>
                <span style={SYMBOL}>: </span>
                <span style={TYPE}>STRING</span>
                <span style={SYMBOL}>,</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>type</span>
                <span style={SYMBOL}>: </span>
                <span style={TYPE}>VARCHAR</span>
                <span style={SYMBOL}>, </span>
                <span style={KEYWORD}>length</span>
                <span style={SYMBOL}>: &#123; </span>
                <span style={KEYWORD}>value</span>
                <span style={SYMBOL}>: </span>
                <span style={ANNOTATION}>16</span>
                <span style={SYMBOL}> &#125;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={SYMBOL}>&#125;];</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>option</span>
                <span style={SYMBOL}> (</span>
                <span style={ANNOTATION}>hope.persistence.table</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>name</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;MOVIE&quot;</span>
                <span style={SYMBOL}>,</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>wires</span>
                <span style={SYMBOL}>: [</span>
                <span style={TYPE}>IDENTIFIABLE</span>
                <span style={SYMBOL}>, </span>
                <span style={TYPE}>AUDITABLE</span>
                <span style={SYMBOL}>]</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={SYMBOL}>&#125;;</span>
              </span>
              <span className="line">
                <span style={SYMBOL}>&#125;</span>
              </span>
            </code>
          </code>
        </pre>
      </div>
    </Editor>
  );
}

function LiquibaseCode() {
  return (
    <Editor>
      <div
        className={clsx(
          "*:flex *:*:max-w-none *:*:shrink-0 *:*:grow *:overflow-auto *:rounded-lg *:bg-white/10! *:p-5 dark:*:bg-white/5!",
          "**:[.line]:isolate **:[.line]:block **:[.line]:not-last:min-h-[1lh]",
          "*:inset-ring *:inset-ring-white/10 dark:*:inset-ring-white/5",
        )}
      >
        <pre tabIndex={0}>
          <code>
            <code>
              <span className="line">
                <span style={COMMENT}>&lt;!-- Auto-generated by ApiHug --&gt;</span>
              </span>
              <span className="line">
                <span style={TAG}>&lt;createTable</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>remarks</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;Movie&quot;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={ATTR}>tableName</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;MOVIE&quot;</span>
                <span style={TAG}>&gt;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TAG}>&lt;column</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>name</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;ID&quot;</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>type</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;BIGINT&quot;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={ATTR}>autoIncrement</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;true&quot;</span>
                <span style={TAG}>&gt;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={TAG}>&lt;constraints</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>primaryKey</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;true&quot;</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>unique</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;true&quot;</span>
                <span style={TAG}> /&gt;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TAG}>&lt;/column&gt;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TAG}>&lt;column</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>name</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;NAME&quot;</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>type</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;VARCHAR(64)&quot;</span>
                <span style={TAG}>&gt;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={TAG}>&lt;constraints</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>nullable</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;false&quot;</span>
                <span style={TAG}> /&gt;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TAG}>&lt;/column&gt;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TAG}>&lt;column</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>name</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;DESCRIPTION&quot;</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>type</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;VARCHAR(255)&quot;</span>
                <span style={TAG}> /&gt;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TAG}>&lt;column</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>name</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;LEVEL&quot;</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>type</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;VARCHAR(16)&quot;</span>
                <span style={TAG}> /&gt;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TAG}>&lt;column</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>name</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;CREATED&quot;</span>
                <span style={SYMBOL}> </span>
                <span style={ATTR}>type</span>
                <span style={SYMBOL}>=</span>
                <span style={STRING}>&quot;TIMESTAMP&quot;</span>
                <span style={TAG}> /&gt;</span>
              </span>
              <span className="line">
                <span style={TAG}>&lt;/createTable&gt;</span>
              </span>
            </code>
          </code>
        </pre>
      </div>
    </Editor>
  );
}

function EntityCode() {
  return (
    <Editor>
      <div
        className={clsx(
          "*:flex *:*:max-w-none *:*:shrink-0 *:*:grow *:overflow-auto *:rounded-lg *:bg-white/10! *:p-5 dark:*:bg-white/5!",
          "**:[.line]:isolate **:[.line]:block **:[.line]:not-last:min-h-[1lh]",
          "*:inset-ring *:inset-ring-white/10 dark:*:inset-ring-white/5",
        )}
      >
        <pre tabIndex={0}>
          <code>
            <code>
              <span className="line">
                <span style={ANNOTATION}>@Entity</span>
              </span>
              <span className="line">
                <span style={ANNOTATION}>@Table</span>
                <span style={SYMBOL}>(name = </span>
                <span style={STRING}>&quot;MOVIE&quot;</span>
                <span style={SYMBOL}>)</span>
              </span>
              <span className="line">
                <span style={ANNOTATION}>@Auditable</span>
              </span>
              <span className="line">
                <span style={KEYWORD}>public class </span>
                <span style={TYPE}>Movie </span>
                <span style={KEYWORD}>implements </span>
                <span style={TYPE}>Identifiable</span>
                <span style={SYMBOL}>&lt;</span>
                <span style={TYPE}>Long</span>
                <span style={SYMBOL}>&gt; &#123;</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={ANNOTATION}>@Id</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={ANNOTATION}>@GeneratedValue</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>private </span>
                <span style={TYPE}>Long</span>
                <span style={SYMBOL}> id;</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={ANNOTATION}>@Column</span>
                <span style={SYMBOL}>(name = </span>
                <span style={STRING}>&quot;NAME&quot;</span>
                <span style={SYMBOL}>, length = </span>
                <span style={ANNOTATION}>64</span>
                <span style={SYMBOL}>, nullable = </span>
                <span style={KEYWORD}>false</span>
                <span style={SYMBOL}>)</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>private </span>
                <span style={TYPE}>String</span>
                <span style={SYMBOL}> name;</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={ANNOTATION}>@Column</span>
                <span style={SYMBOL}>(name = </span>
                <span style={STRING}>&quot;DESCRIPTION&quot;</span>
                <span style={SYMBOL}>, length = </span>
                <span style={ANNOTATION}>255</span>
                <span style={SYMBOL}>)</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>private </span>
                <span style={TYPE}>String</span>
                <span style={SYMBOL}> description;</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={ANNOTATION}>@Enumerated</span>
                <span style={SYMBOL}>(EnumType.STRING)</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={ANNOTATION}>@Column</span>
                <span style={SYMBOL}>(name = </span>
                <span style={STRING}>&quot;LEVEL&quot;</span>
                <span style={SYMBOL}>, length = </span>
                <span style={ANNOTATION}>16</span>
                <span style={SYMBOL}>)</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>private </span>
                <span style={TYPE}>MovieLevel</span>
                <span style={SYMBOL}> level;</span>
              </span>
              <span className="line">
                <span style={SYMBOL}>&#125;</span>
              </span>
            </code>
          </code>
        </pre>
      </div>
    </Editor>
  );
}
