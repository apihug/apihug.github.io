"use client";

import { useState } from "react";
import clsx from "clsx";
import GridContainer from "../grid-container";
import { Editor } from "./editor";
import LinkButton from "./link-button";
import CategoryHeader from "./category-header";
import { BentoItem } from "./bento";

const SYMBOL = { color: "var(--color-slate-400)" };
const KEYWORD = { color: "var(--color-slate-300)" };
const STRING = { color: "var(--color-sky-300)" };
const TYPE = { color: "var(--color-emerald-400)" };
const ANNOTATION = { color: "var(--color-amber-400)" };
const COMMENT = { color: "var(--color-slate-500)" };

type TabKey = "service" | "field" | "constant" | "mock";

const TABS: Record<TabKey, { label: string; title: string; description: string }> = {
  service: {
    label: "Service & RPC",
    title: "hope.swagger.operation",
    description:
      "Routes, methods, and pagination declared on RPCs. Generates OpenAPI, Spring controllers, and client SDKs.",
  },
  field: {
    label: "Field Validation",
    title: "hope.swagger.field",
    description:
      "Descriptions, examples, validation, and mock rules defined as field metadata in the contract.",
  },
  constant: {
    label: "Enum Constants",
    title: "hope.constant.field",
    description:
      "Codes, i18n messages, and error mappings on enum values. Generates type-safe constants.",
  },
  mock: {
    label: "Mock Generation",
    title: "hope.mock",
    description:
      "Built-in nature types such as MOVIE, BOOK, EMAIL, and PHONE for realistic test data.",
  },
};

export default function ProtoSemanticSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("service");

  return (
    <div className="relative max-w-full">
      <GridContainer className="2xl:before:hidden 2xl:after:hidden">
        <CategoryHeader className="text-sky-500 dark:text-sky-400">Proto Semantic</CategoryHeader>
      </GridContainer>

      <GridContainer>
        <h2 className="max-w-lg px-2 text-[2.5rem]/10 font-medium tracking-tighter text-balance max-sm:px-4 2xl:mt-0">
          Protobuf with execution semantics.
        </h2>
      </GridContainer>

      <GridContainer className="mt-4">
        <p className="max-w-(--breakpoint-md) px-2 text-base/7 text-gray-600 max-sm:px-4 dark:text-gray-400">
          ApiHug extends protobuf with routing, validation, persistence, mocking, and versioning. Structured semantics stay in the contract, where engineers and LLMs can use them reliably.
        </p>
      </GridContainer>

      {/* Tab buttons + code */}
      <GridContainer className="mt-16">
        <div className="flex flex-wrap gap-2 px-2 max-sm:px-4">
          {(Object.keys(TABS) as TabKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm/6 font-medium transition-colors",
                activeTab === key
                  ? "bg-black text-white dark:bg-white dark:text-gray-950"
                  : "bg-gray-950/5 text-gray-600 hover:bg-gray-950/10 dark:bg-white/8 dark:text-gray-400 dark:hover:bg-white/12",
              )}
            >
              {TABS[key].label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 px-2 max-sm:px-4 lg:grid-cols-2 lg:grid-rows-[min-content]">
          {/* Info */}
          <div className="flex flex-col justify-center gap-4">
            <div className="font-mono text-sm/6 font-semibold tracking-widest uppercase text-amber-500 dark:text-amber-400">
              {TABS[activeTab].title}
            </div>
            <p className="text-base/7 text-gray-600 dark:text-gray-400">{TABS[activeTab].description}</p>
            <div className="mt-4">
              <LinkButton href="/docs/protobuf">Explore proto extensions</LinkButton>
            </div>
          </div>

          {/* Code - all blocks stacked, only active one visible. Prevents layout shift on tab switch */}
          <div className="relative h-[38rem]">
            <div className={clsx("absolute inset-0", activeTab !== "service" && "invisible")}>
              <ServiceCode />
            </div>
            <div className={clsx("absolute inset-0", activeTab !== "field" && "invisible")}>
              <FieldCode />
            </div>
            <div className={clsx("absolute inset-0", activeTab !== "constant" && "invisible")}>
              <ConstantCode />
            </div>
            <div className={clsx("absolute inset-0", activeTab !== "mock" && "invisible")}>
              <MockCode />
            </div>
          </div>
        </div>
      </GridContainer>

      {/* Extension diagram - Bento grid like why-tailwind-css-section */}
      <GridContainer className="mt-16">
        <div className="grid w-full grid-flow-dense grid-cols-6 gap-2 bg-gray-950/5 p-2 dark:bg-white/10 sm:grid-cols-12">
          {[
            { name: "swagger", desc: "API & OpenAPI routing", mono: "hope.swagger" },
            { name: "persistence", desc: "Domain entities & Liquibase", mono: "hope.persistence" },
            { name: "constant", desc: "Enum constants & errors", mono: "hope.constant" },
            { name: "mock", desc: "40+ nature type generators", mono: "hope.mock" },
            { name: "domain", desc: "Views & query objects", mono: "hope.domain" },
            { name: "version", desc: "API versioning strategy", mono: "hope.version" },
          ].map((ext) => (
            <BentoItem key={ext.name} className={clsx("col-span-3 sm:col-span-4 lg:col-span-2")}>
              <div className="flex flex-col gap-1 p-4">
                <span className="font-mono text-xs/5 font-bold text-gray-950 dark:text-white">{ext.mono}</span>
                <span className="text-sm/6 text-gray-600 dark:text-gray-400">{ext.desc}</span>
              </div>
            </BentoItem>
          ))}
        </div>
      </GridContainer>
    </div>
  );
}

function ServiceCode() {
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
                <span style={KEYWORD}>service</span>
                <span style={TYPE}> OrderService </span>
                <span style={SYMBOL}>&#123;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={COMMENT}>// Service-level config</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>option</span>
                <span style={SYMBOL}> (</span>
                <span style={ANNOTATION}>hope.swagger.svc</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>path</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;/order&quot;</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>description</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;Order Service&quot;</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={SYMBOL}>&#125;</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>rpc</span>
                <span style={TYPE}> Place </span>
                <span style={SYMBOL}>(</span>
                <span style={TYPE}>PlaceOrderRequest</span>
                <span style={SYMBOL}>)</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>returns </span>
                <span style={SYMBOL}>(</span>
                <span style={TYPE}>OrderPlacedResponse</span>
                <span style={SYMBOL}>) &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>option</span>
                <span style={SYMBOL}> (</span>
                <span style={ANNOTATION}>hope.swagger.operation</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>post</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;/place&quot;</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>description</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;place a new order&quot;</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={SYMBOL}>&#125;;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={SYMBOL}>&#125;</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>rpc</span>
                <span style={TYPE}> Query </span>
                <span style={SYMBOL}>(</span>
                <span style={TYPE}>QueryOrderRequest</span>
                <span style={SYMBOL}>)</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>returns </span>
                <span style={SYMBOL}>(</span>
                <span style={TYPE}>OrderView</span>
                <span style={SYMBOL}>) &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>option</span>
                <span style={SYMBOL}> (</span>
                <span style={ANNOTATION}>hope.swagger.operation</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>get</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;/query&quot;</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>pageable</span>
                <span style={SYMBOL}>: </span>
                <span style={KEYWORD}>true</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={SYMBOL}>&#125;;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={SYMBOL}>&#125;</span>
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

function FieldCode() {
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
                <span style={ANNOTATION}>hope.swagger.field</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>description</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;name of the movie&quot;</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>example</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;The Lord of the Rings&quot;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>empty</span>
                <span style={SYMBOL}>: </span>
                <span style={TYPE}>FALSE</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>mock</span>
                <span style={SYMBOL}>: &#123; </span>
                <span style={KEYWORD}>nature</span>
                <span style={SYMBOL}>: </span>
                <span style={TYPE}>MOVIE</span>
                <span style={SYMBOL}> &#125;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>max_length</span>
                <span style={SYMBOL}>: </span>
                <span style={ANNOTATION}>64</span>
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
                <span style={ANNOTATION}>2</span>
                <span style={SYMBOL}> [(</span>
                <span style={ANNOTATION}>hope.swagger.field</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>description</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;level of the movie&quot;</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>example</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;PG_13&quot;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>empty</span>
                <span style={SYMBOL}>: </span>
                <span style={TYPE}>FALSE</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={SYMBOL}>&#125;];</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={KEYWORD}>uint32</span>
                <span style={SYMBOL}> year = </span>
                <span style={ANNOTATION}>3</span>
                <span style={SYMBOL}> [(</span>
                <span style={ANNOTATION}>hope.swagger.field</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>description</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;publish year&quot;</span>
                <span style={SYMBOL}>;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={KEYWORD}>example</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;2022&quot;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={SYMBOL}>&#125;];</span>
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

function ConstantCode() {
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
                <span style={KEYWORD}>enum</span>
                <span style={TYPE}> MovieLevel </span>
                <span style={SYMBOL}>&#123;</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>PG_13</span>
                <span style={SYMBOL}> = </span>
                <span style={ANNOTATION}>0</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={SYMBOL}>[(</span>
                <span style={ANNOTATION}>hope.constant.field</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>code</span>
                <span style={SYMBOL}>: </span>
                <span style={ANNOTATION}>1</span>
                <span style={SYMBOL}>,</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>message</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;PG-13&quot;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={SYMBOL}>&#125;];</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>R</span>
                <span style={SYMBOL}> = </span>
                <span style={ANNOTATION}>1</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={SYMBOL}>[(</span>
                <span style={ANNOTATION}>hope.constant.field</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>code</span>
                <span style={SYMBOL}>: </span>
                <span style={ANNOTATION}>2</span>
                <span style={SYMBOL}>,</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>message</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;R&quot;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={SYMBOL}>&#125;];</span>
              </span>
              <span className="line"></span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>NC_17</span>
                <span style={SYMBOL}> = </span>
                <span style={ANNOTATION}>3</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={SYMBOL}>[(</span>
                <span style={ANNOTATION}>hope.constant.field</span>
                <span style={SYMBOL}>) = &#123;</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>code</span>
                <span style={SYMBOL}>: </span>
                <span style={ANNOTATION}>4</span>
                <span style={SYMBOL}>,</span>
              </span>
              <span className="line">
                <span>{"      "}</span>
                <span style={KEYWORD}>message</span>
                <span style={SYMBOL}>: </span>
                <span style={STRING}>&quot;NC-17&quot;</span>
              </span>
              <span className="line">
                <span>{"    "}</span>
                <span style={SYMBOL}>&#125;];</span>
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

function MockCode() {
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
                <span style={COMMENT}>// 40+ built-in nature types for mock data</span>
              </span>
              <span className="line">
                <span style={KEYWORD}>enum</span>
                <span style={TYPE}> Nature </span>
                <span style={SYMBOL}>&#123;</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>ANIMAL</span>
                <span style={SYMBOL}> = 0;      </span>
                <span style={COMMENT}>// random animal names</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>AVATAR</span>
                <span style={SYMBOL}> = 2;      </span>
                <span style={COMMENT}>// avatar image URLs</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>BOOK</span>
                <span style={SYMBOL}> = 4;        </span>
                <span style={COMMENT}>// book titles</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>COLOR</span>
                <span style={SYMBOL}> = 8;       </span>
                <span style={COMMENT}>// color names</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>COUNTRY</span>
                <span style={SYMBOL}> = 10;    </span>
                <span style={COMMENT}>// country names</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>CURRENCY</span>
                <span style={SYMBOL}> = 11;   </span>
                <span style={COMMENT}>// currency names</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>DATE_AND_TIME</span>
                <span style={SYMBOL}> = 12;</span>
                <span style={COMMENT}> // random dates</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>DOG</span>
                <span style={SYMBOL}> = 13;        </span>
                <span style={COMMENT}>// dog breed names</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>FOOD</span>
                <span style={SYMBOL}> = 14;       </span>
                <span style={COMMENT}>// food names</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>MOVIE</span>
                <span style={SYMBOL}> = 20;      </span>
                <span style={COMMENT}>// movie titles</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>NAME</span>
                <span style={SYMBOL}> = 22;       </span>
                <span style={COMMENT}>// person names</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>EMAIL</span>
                <span style={SYMBOL}> = 24;      </span>
                <span style={COMMENT}>// email addresses</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>PHONE</span>
                <span style={SYMBOL}> = 26;      </span>
                <span style={COMMENT}>// phone numbers</span>
              </span>
              <span className="line">
                <span>{"  "}</span>
                <span style={TYPE}>URL</span>
                <span style={SYMBOL}> = 36;        </span>
                <span style={COMMENT}>// random URLs</span>
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
