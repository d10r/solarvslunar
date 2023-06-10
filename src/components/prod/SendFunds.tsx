
import { Framework } from "@superfluid-finance/sdk-core";
import { wagmiRpcProvider } from "../Wallet/WagmiProvider";
import network from "../../configuration/network";
import { useProvider, useSigner, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Amount from "@/src/components/prod/Amount";
import FlowingBalance from "../FlowingBalance";

export const SendFunds = () => {

    const [amount, setAmount] = useState("0");

    const [totalFlowRate, setTotalFlowRate] = useState(0);
    const [gambleAmount, setGambleAmount] = useState(0);
    const [txnReceipt, setTxnReceipt] = useState("");

    useEffect(() => {
        // here we call the subgraph to get the total flowrate for the hill
        
        
        setTotalFlowRate(10000000);
    }, []);


    useEffect(() => {
        // here we call the contract directly to get the gamble amount
        // we should then make it tick down, maybe fake it
        
        setGambleAmount(100000000000);
    }, []);

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
        const receipt = txnResponse && await txnResponse.wait() as any;
        setTxnReceipt(receipt);
        // Transaction Complete when code reaches here
    }

    return (
        <div>
            {
                !txnReceipt 
                ? (
                    <>
                        <div>You will receive: </div>
                        <div><Amount wei={totalFlowRate*24/3600}/>/ day</div>
                        <div>The current Gamble amount is:</div>
                        <div><Amount wei={amount}/></div>
                        <div>How much do you want to send?</div>
                        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <button onClick={sendFunds}>Send()</button>
                    </>
                )
                : (
                    <>
                        <div>Transaction Complete!</div> 
                        <div>Receipt: {txnReceipt}</div>
                        <div>You are now receiving</div>
                        <div><Amount wei={totalFlowRate*24/3600}/>/ day</div>
                        <div>
                            <FlowingBalance 
                                balance="0" 
                                balanceTimestamp={Number(new Date())}
                                flowRate={totalFlowRate.toString()}
                            />
                        </div>
                    </>
                )
            }
        </div>
    )
}

