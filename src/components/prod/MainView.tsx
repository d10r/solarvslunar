
import { Framework } from "@superfluid-finance/sdk-core";
import { wagmiRpcProvider } from "./Wallet/WagmiProvider";
import network from "../configuration/network";
import { useProvider, useSigner, useAccount } from "wagmi";
import { useState } from "react";

export const MainView = (good:any = true) => {

    // good needs to gamble

    // bad needs to start streams (approve + stream + approveSubscriptions)

    return (
        <div>
            {
                good
                ? <SendFunds />
                : <CreateStream />
            }
        </div>
    )
}

export const SendFunds = () => {

    const [amount, setAmount] = useState("0");

    const sendFunds = async () => {
        const sf = await Framework.create({
            chainId: network.id,
            provider: wagmiRpcProvider({ chainId: network.id }),
            customSubgraphQueriesEndpoint: network.subgraphUrl,
        })
        const provider = useProvider();
        const { data: signer } = useSigner();
        const account = useAccount();

        const token = await sf.loadSuperToken(network.cashToken);
        
        // Write operation example
        const transferOperation = token.send({ recipient: network.hillAddress, amount });
        const txnResponse = signer && await transferOperation.exec(signer);
        const txnReceipt = txnResponse && await txnResponse.wait();
        // Transaction Complete when code reaches here
    }

    return (
        <div>
            <div>How much do you want to send?</div>
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={sendFunds}>Send()</button>
        </div>
    )
}



export const CreateStream = () => {

    const [flowRate, setFlowRate] = useState("0");

    const sendStream = async () => {
        const sf = await Framework.create({
            chainId: network.id,
            provider: wagmiRpcProvider({ chainId: network.id }),
            customSubgraphQueriesEndpoint: network.subgraphUrl,
        })
        const { data: signer } = useSigner();

        const token = await sf.loadSuperToken(network.cashToken);
        // Write operation example

        const approveOp = token.approve({ receiver: network.hillAddress, amount: "1000000000" });
        const sendStreamOp = token.createFlow({ receiver: network.hillAddress, flowRate: "1000000000" });
        const approveSubscriptionsOp = token.approveSubscription({ publisher: network.hillAddress, indexId: "23" });
        const batchCall = sf.batchCall([approveOp, sendStreamOp, approveSubscriptionsOp]);

        const txnResponse = signer && await batchCall.exec(signer);
        const txnReceipt = txnResponse && await txnResponse.wait();
        // Transaction Complete when code reaches here
    }

    return (
        <div>
            <div>How much do you want to stream?</div>
            <input type="text" value={flowRate} onChange={(e) => setFlowRate(e.target.value)} />
            <button onClick={sendStream}>createStream</button>
        </div>
    )
}