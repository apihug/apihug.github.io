import { BuildAnything } from '@/components/home/BuildAnything'
import { Performance } from '@/components/home/zhCN/Performance'
import { ComponentDriven } from '@/components/home/zhCN/ComponentDriven'
import { EditorTools } from '@/components/home/zhCN/EditorTools'
import { ReadyMadeComponents } from '@/components/home/zhCN/ReadyMadeComponents'
import { Footer } from '@/components/home/Footer'
import NextLink from 'next/link'
import Head from 'next/head'

function Header() {
  return (
    <header className="relative">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="relative max-w-5xl mx-auto pt-20 sm:pt-24 lg:pt-32">
          <h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">
            API {' '}设计 {' '}&{' '} 开发{' '}{' '}新范式
          </h1>
          <p className="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">
            <code className="font-mono font-medium text-sky-500 dark:text-sky-400">设计</code>{' '}优先，{' '}{' '}体验高度 {' '}
            <code className="font-mono font-medium text-sky-500 dark:text-sky-400">语言化</code>、{' '}
            <code className="font-mono font-medium text-sky-500 dark:text-sky-400">模块化</code>{' '}和{' '}
            <code className="font-mono font-medium text-sky-500 dark:text-sky-400">
              可视化
            </code>{' '} 新API之旅<br/> 一体化{' '}<code className="font-mono font-medium text-sky-500 dark:text-sky-400">分发</code>、{' '}
            <code className="font-mono font-medium text-sky-500 dark:text-sky-400">监控</code>、 {' '}
            <code className="font-mono font-medium text-sky-500 dark:text-sky-400">管理</code> {' '}您的API资产
          </p>
          <div className="mt-6 sm:mt-10 flex justify-center space-x-6 text-sm">
            <NextLink
              href="/zhCN-docs/start"
              className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
            >
              现在开始
            </NextLink>
          </div>
        </div>
      </div>
      <BuildAnything />
    </header>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <meta
          key="twitter:title"
          name="twitter:title"
          content="ApiHug - API Design & Develop New Paradigm."
        />
        <meta
          key="og:title"
          property="og:title"
          content="ApiHug - API Design & Develop New Paradigm."
        />
        <title>ApiHug - API Design & Develop New Paradigm.</title>
      </Head>
      <div className="overflow-hidden">
        <Header />
      </div>
      <div
        className="pt-20 mb-20 flex flex-col gap-y-20 overflow-hidden sm:pt-32 sm:mb-32 sm:gap-y-32 md:pt-40 md:mb-40 md:gap-y-40">
        <EditorTools/>
        <Performance/>
        <ComponentDriven/>
        <ReadyMadeComponents/>
      </div>
      <Footer/>
    </>
  )
}

Home.layoutProps = {
}
