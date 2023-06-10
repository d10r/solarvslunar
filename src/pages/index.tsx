import Head from "next/head";
import styled from "styled-components";
import { useAccount } from "wagmi";
import ConnectView from "../components/ConnectView";
import GameView from "../components/GameView";

const Layout = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: stretch;

  > * {
    flex: 1;
  }
`;

export default function Home() {
  const { address } = useAccount();

  return (
    <>
      <Head>
        <title>Human Nature - a ETH Prague Hackaton Project utilizing Superfluid Streams</title>
        <meta charset="utf-8" />
        <meta name="viewport"     content="width=device-width,initial-scale=1.0"/>
        <meta name="robots"       content="noindex,nofollow"/>
        <meta name="description"  content="ETH Prague Hackaton Project - utilizing Superfluid Streams"/>
        <meta name="keywords"     content=""/>
      </Head>
      <Layout>
        
        <MainView />
        
      </Layout>
    </>
  );
}

