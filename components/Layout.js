import Head from "next/head";

export default function Layout({ title, keywords, description, children, className = "" }) {
  return (
    <div className="font-poppins bg-bg min-h-screen relative">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <div className={`text-dark overflow-x-hidden min-h-screen ${className}`}>{children}</div>
    </div>
  );
}

Layout.defaultProps = {
  title: "Buy Tomster a coffee!",
  description: "This is a Web3 app to buy Tomster a coffee",
  keywords: "web3, alchemy, blockchain",
};
