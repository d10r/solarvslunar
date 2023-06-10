import { AccountTokenSnapshot } from "@superfluid-finance/sdk-core";
import { BigNumber } from "ethers";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useContractRead } from "wagmi";
import KingOfTheHillABI from "../configuration/KingOfTheHillABI";
import network from "../configuration/network";
import { rpcApi, subgraphApi } from "../redux/store";

interface GameContextValue {
  king?: string;
  armyFlowRate?: BigNumber;
  treasureSnapshot: AccountTokenSnapshot | null | undefined;
}
const GameContext = createContext<GameContextValue>(null!);

const GameContextProvider: FC<PropsWithChildren> = ({ children }) => {

  /*
    The game contract is:
    - Receiving all the streams. Use Subgraph to calculate the sum
    - Call it "totalIncome"

    Hill is the contract
    - Hill is receiving all the streams

    While CashToken is the token we're using 

  
    Looks like armyFlowRate can be used as a basis to poll the contract for the current gamble size

  */


  const kingRequest = rpcApi.useGetActiveKingQuery();
  const [armyFlowRateTrigger, armyFlowRateRequest] =
    rpcApi.useLazyGetArmyFlowRateQuery();

  useEffect(() => {
    armyFlowRateTrigger();

    setInterval(() => {
      armyFlowRateTrigger();
    }, 10000);
  }, [armyFlowRateTrigger]);

  const hillTreasureSnapshotQuery = subgraphApi.useAccountTokenSnapshotQuery({
    chainId: network.id,
    id: `${network.hillAddress}-${network.cashToken}`,
  });

  const contextValue = useMemo(() => {
    return {
      king: kingRequest.data,
      armyFlowRate: armyFlowRateRequest.data
        ? BigNumber.from(armyFlowRateRequest.data)
        : undefined,
      treasureSnapshot: hillTreasureSnapshotQuery.data,
    };
  }, [
    kingRequest.data,
    armyFlowRateRequest.data,
    hillTreasureSnapshotQuery.data,
  ]);

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

export default GameContextProvider;

export const useGameContext = () => useContext(GameContext);
