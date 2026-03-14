import dynamic from 'next/dynamic';
import Head from 'next/head';

const SyntraWorkspace = dynamic(() => import('@/App.jsx'), {
  ssr: false,
  loading: () => <div className="platform-loading">Booting Syntra workspace…</div>,
});

export default function PlatformPage() {
  return (
    <>
      <Head>
        <title>Syntra Workspace</title>
        <meta
          name="description"
          content="Full Syntra growth workspace with dashboards, planning tools, and AI copilots."
        />
      </Head>
      <SyntraWorkspace />
    </>
  );
}
