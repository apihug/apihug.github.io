"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import GridContainer from "../grid-container";
import { Editor } from "./editor";

type PlatformKey = "powershell" | "cmd" | "bash";

const PLATFORMS: Record<PlatformKey, { label: string; command: string }> = {
  powershell: {
    label: "PowerShell",
    command: "iex (irm 'https://raw.githubusercontent.com/apihug/apihug.github.io/main/helper/apihug-install.ps1')",
  },
  cmd: {
    label: "Command",
    command: 'powershell -c "irm https://raw.githubusercontent.com/apihug/apihug.github.io/main/helper/apihug-install.ps1 | iex"',
  },
  bash: {
    label: "macOS / Linux",
    command: "curl -fsSL https://raw.githubusercontent.com/apihug/apihug.github.io/main/helper/apihug-install.sh | bash",
  },
};

const SYMBOL = { color: "var(--color-slate-400)" };
const KEYWORD = { color: "var(--color-slate-300)" };
const STRING = { color: "var(--color-sky-300)" };
const COMMENT = { color: "var(--color-slate-500)" };
const TYPE = { color: "var(--color-emerald-400)" };
const ANNOTATION = { color: "var(--color-amber-400)" };

const Hero: React.FC = () => {
  let [step, setStep] = useState(0);
  let [isTyping, setIsTyping] = useState(false);
  let [cycle, setCycle] = useState(0);

  let shouldAutostartTypingAnimations =
    "window" in globalThis ? window.matchMedia("(min-width: 48rem)").matches : false;

  function nextStep() {
    setStep((step) => step + 1);
    setIsTyping(false);
    setTimeout(() => setIsTyping(true), TRANSITION.duration * 1000);
  }

  useEffect(() => {
    function start() {
      setIsTyping(true);
    }
    let timeout = setTimeout(start, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Auto-repeat typing animation after all steps complete
  useEffect(() => {
    if (step >= 6) {
      let timeout = setTimeout(() => {
        setStep(0);
        setIsTyping(false);
        setCycle((c) => c + 1);
        setTimeout(() => setIsTyping(true), 1000);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  return (
    <div>
      <GridContainer className="pt-8 sm:pt-10">
        <p className="px-2 font-mono text-sm/6 font-medium tracking-widest text-gray-500 uppercase max-sm:px-4 dark:text-gray-400">
          API as Architecture
        </p>
        <h1 className="mt-2 px-2 text-4xl/11 font-medium tracking-tight text-balance max-sm:px-4 sm:text-5xl/[1.05] lg:text-6xl/[1.02]">
          One contract for{" "}
          <span className="inline-block pb-[0.08em] bg-linear-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent dark:from-sky-300 dark:to-cyan-200">
            APIs
          </span>
          ,{" "}
          <span className="inline-block pb-[0.08em] bg-linear-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent dark:from-emerald-300 dark:to-teal-200">
            systems
          </span>
          , and{" "}
          <span className="inline-block pb-[0.08em] bg-linear-to-r from-violet-500 to-fuchsia-400 bg-clip-text text-transparent dark:from-violet-300 dark:to-fuchsia-200">
            agents
          </span>
          .
        </h1>
      </GridContainer>
      <GridContainer className="mt-4">
        <p className="max-w-(--breakpoint-md) px-2 text-lg/7 font-medium text-gray-600 max-sm:px-4 dark:text-gray-400">
          Define{" "}
          <span className="font-mono text-[1.0625rem] text-sky-500 dark:text-sky-400">APIs</span>,{" "}
          <span className="font-mono text-[1.0625rem] text-sky-500 dark:text-sky-400">services</span>,{" "}
          <span className="font-mono text-[1.0625rem] text-sky-500 dark:text-sky-400">databases</span>, and{" "}
          <span className="font-mono text-[1.0625rem] text-sky-500 dark:text-sky-400">AI tools</span> from one protobuf contract. ApiHug keeps engineers and agents on the same system model.
        </p>
      </GridContainer>
      <GridContainer className="mt-8 sm:mt-10 sm:px-2">
        <QuickStart />
      </GridContainer>
      <GridContainer className="mt-24">
        <div key={cycle} className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[1fr]">
          {/* Proto editor */}
          <div className="flex flex-col bg-gray-950/5 p-2 lg:-mr-px dark:bg-white/10">
            <div className="mb-2 px-3 pt-1">
              <div className="font-mono text-xs text-gray-400">order.proto</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Define your API contract in protobuf</div>
            </div>
            <Editor>
              <div
                className={clsx(
                  "flex h-full flex-col",
                  "*:flex *:*:max-w-none *:*:shrink-0 *:*:grow *:overflow-auto *:rounded-lg *:bg-white/10! *:p-5 dark:*:bg-white/5!",
                  "**:[.line]:isolate **:[.line]:block **:[.line]:not-last:min-h-[1lh]",
                  "*:inset-ring *:inset-ring-white/10 dark:*:inset-ring-white/5",
                )}
              >
                <pre tabIndex={0} className="flex-1">
                  <code>
                    <code>
                      <span className="line">
                        <span style={KEYWORD}>syntax</span>
                        <span style={SYMBOL}> = </span>
                        <span style={STRING}>&quot;proto3&quot;</span>
                        <span style={SYMBOL}>;</span>
                      </span>
                      <span className="line">
                        <span style={SYMBOL}></span>
                      </span>
                      <span className="line">
                        <span style={KEYWORD}>service</span>
                        <span style={TYPE}> OrderService </span>
                        <span style={SYMBOL}>&#123;</span>
                      </span>
                      <span className="line">
                        <span>{"  "}</span>
                        <span style={KEYWORD}>rpc</span>
                        <span style={TYPE}> Place </span>
                        <span style={SYMBOL}>(</span>
                        <TypeWord
                          isTyping={isTyping}
                          word="PlaceOrderRequest"
                          step={0}
                          currentStep={step}
                          onNextStep={nextStep}
                          autostart={shouldAutostartTypingAnimations}
                          style={TYPE}
                        />
                        <span style={SYMBOL}>)</span>
                      </span>
                      <span className="line">
                        <span>{"    "}</span>
                        <span style={KEYWORD}>returns </span>
                        <span style={SYMBOL}>(</span>
                        <TypeWord
                          isTyping={isTyping}
                          word="OrderPlacedResponse"
                          step={1}
                          currentStep={step}
                          onNextStep={nextStep}
                          autostart={shouldAutostartTypingAnimations}
                          style={TYPE}
                        />
                        <span style={SYMBOL}>) &#123;</span>
                      </span>
                      <span className="line">
                        <span>{"      "}</span>
                        <TypeWord
                          isTyping={isTyping}
                          word={`option (hope.swagger.operation) = {`}
                          step={2}
                          currentStep={step}
                          onNextStep={nextStep}
                          autostart={shouldAutostartTypingAnimations}
                          style={ANNOTATION}
                        />
                      </span>
                      <span className="line">
                        <span>{"        "}</span>
                        <TypeWord
                          isTyping={isTyping}
                          word={`get: "/place";`}
                          step={3}
                          currentStep={step}
                          onNextStep={nextStep}
                          autostart={shouldAutostartTypingAnimations}
                          style={STRING}
                        />
                      </span>
                      <span className="line">
                        <span>{"      "}</span>
                        <span style={SYMBOL}>&#125;;</span>
                      </span>
                      <span className="line">
                        <span>{"    "}</span>
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
          </div>
          {/* Java editor - generated output */}
          <div className="relative flex flex-col border-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 p-2 dark:[--pattern-fg:var(--color-white)]/10">
            <div className="mb-2 px-3 pt-1">
              <div className="font-mono text-xs text-gray-500 dark:text-gray-400">OrderController.java</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">ApiHug generates your API controller</div>
            </div>
            <Editor>
              <div
                className={clsx(
                  "flex h-full flex-col",
                  "*:flex *:*:max-w-none *:*:shrink-0 *:*:grow *:overflow-auto *:rounded-lg *:bg-white/10! *:p-5 dark:*:bg-white/5!",
                  "**:[.line]:isolate **:[.line]:block **:[.line]:not-last:min-h-[1lh]",
                  "*:inset-ring *:inset-ring-white/10 dark:*:inset-ring-white/5",
                )}
              >
                <pre tabIndex={0} className="flex-1">
                  <code>
                    <code>
                      <span className="line">
                        <span style={SYMBOL}></span>
                      </span>
                      <span className="line">
                        <motion.span
                          initial="hidden"
                          variants={{ visible: { transition: { staggerChildren: 0.02, delayChildren: 0.5 } } }}
                          {...(step >= 2 ? (shouldAutostartTypingAnimations ? { whileInView: "visible", viewport: { once: true } } : { animate: "visible" }) : {})}
                          style={ANNOTATION}
                        >
                          {`@RestController`.split("").map((letter, i) => (
                            <motion.span key={i} variants={{ hidden: { display: "none" }, visible: { display: "inline" } }}>
                              {letter}
                            </motion.span>
                          ))}
                        </motion.span>
                      </span>
                      <span className="line">
                        <span style={KEYWORD}>public class </span>
                        <span style={TYPE}>OrderController </span>
                        <span style={SYMBOL}>&#123;</span>
                      </span>
                      <span className="line">
                        <span>{"  "}</span>
                        <span style={ANNOTATION}>@PostMapping</span>
                        <span style={SYMBOL}>(</span>
                        <span style={STRING}>&quot;/order/place&quot;</span>
                        <span style={SYMBOL}>)</span>
                      </span>
                      <span className="line">
                        <span>{"  "}</span>
                        <span style={KEYWORD}>public </span>
                        <TypeWord
                          isTyping={isTyping}
                          word="ResponseEntity<Result<OrderPlacedResponse>>"
                          step={4}
                          currentStep={step}
                          onNextStep={nextStep}
                          autostart={shouldAutostartTypingAnimations}
                          style={TYPE}
                        />
                      </span>
                      <span className="line">
                        <span>{"    "}</span>
                        <span style={SYMBOL}>place(</span>
                        <TypeWord
                          isTyping={isTyping}
                          word="@RequestBody @Valid PlaceOrderRequest req"
                          step={5}
                          currentStep={step}
                          onNextStep={nextStep}
                          autostart={shouldAutostartTypingAnimations}
                          style={KEYWORD}
                        />
                        <span style={SYMBOL}>) &#123;</span>
                      </span>
                      <span className="line">
                        <span>{"    "}</span>
                        <span style={COMMENT}>// Generated by ApiHug</span>
                      </span>
                      <span className="line">
                        <span style={SYMBOL}></span>
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
          </div>
        </div>
      </GridContainer>
    </div>
  );
};

export default Hero;

const TRANSITION = { duration: 0.35 };

function TypeWord({
  word,
  step,
  currentStep,
  isTyping,
  onNextStep,
  autostart,
  style,
}: {
  word: string;
  step: number;
  currentStep: number;
  isTyping: boolean;
  onNextStep: () => void;
  autostart: boolean;
  style?: React.CSSProperties;
}) {
  if (currentStep < step) return null;

  let cursor =
    (step === currentStep && isTyping) || (step + 1 === currentStep && !isTyping) ? (
      <span className="after:animate-typing after:absolute after:mt-1.5 after:inline-block after:h-[1.2em] after:w-px after:border-r-2 after:border-sky-400 after:bg-transparent after:content-['']" />
    ) : null;

  if (!isTyping && currentStep === step) return cursor;

  return (
    <>
      <motion.span
        initial="hidden"
        variants={{ visible: { transition: { staggerChildren: 0.075, delayChildren: 1.4 } } }}
        onAnimationComplete={onNextStep}
        {...(autostart ? { whileInView: "visible", viewport: { once: true } } : { animate: "visible" })}
      >
        {word.split("").map((letter, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { display: "none" },
              visible: { display: "inline" },
            }}
            style={style}
          >
            {letter}
          </motion.span>
        ))}
      </motion.span>
      {cursor}
    </>
  );
}

function QuickStart() {
  const [platform, setPlatform] = useState<PlatformKey>("powershell");
  const [copied, setCopied] = useState(false);

  function copyCommand() {
    navigator.clipboard.writeText(PLATFORMS[platform].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-sm:px-4">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="font-mono text-xs/6 font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500">
          Quick start
        </span>
      </div>
      <div className="rounded-xl bg-gray-950 p-1 lg:w-1/2 dark:inset-ring dark:inset-ring-white/10">
        {/* Platform tabs */}
        <div className="flex items-center gap-1 px-2 pt-1 pb-0">
          {(Object.keys(PLATFORMS) as PlatformKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setPlatform(key)}
              className={clsx(
                "rounded-md px-3 py-1 text-xs/6 font-medium transition-colors",
                platform === key
                  ? "bg-white/15 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-300",
              )}
            >
              {PLATFORMS[key].label}
            </button>
          ))}
        </div>
        {/* Command */}
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 mt-1">
          <code className="flex-1 overflow-x-auto font-mono text-[13px]/6 text-sky-300 whitespace-nowrap scrollbar-none">
            <span className="text-gray-500 select-none">$ </span>
            {PLATFORMS[platform].command}
          </code>
          <button
            onClick={copyCommand}
            className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-emerald-400">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1ZM4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
