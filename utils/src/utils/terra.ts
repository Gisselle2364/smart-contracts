import { isTxError, LCDClient, Msg, Wallet } from '@terra-money/terra.js';

const COLUMBUS = {
  URL: 'https://lcd.terra.dev',
  chainID: 'columbus-5',
  gasPrices: {
    uusd: 0.15,
  },
};

const BOMBAY = {
  URL: 'https://bombay-lcd.terra.dev',
  chainID: 'bombay-12',
  gasPrices: {
    uusd: 0.15,
  },
};

export async function broadcastSingleMsg(
  wallet: Wallet,
  msg: Msg,
  sequence: number
) {
  const tx = await wallet.createAndSignTx({
    msgs: [msg],
    sequence,
  });

  // console.log(JSON.stringify(tx.toData(), null, 2));
  const result = await wallet.lcd.tx.broadcast(tx);
  if (isTxError(result)) {
    throw new Error('msg error: ' + result.code + ' ' + result.raw_log);
  }
  // console.log(result);

  console.log('success: ', result.txhash, msg);

  return result;
}

export async function queryUusdBalance(lcd: LCDClient, address: string) {
  const [coins] = await lcd.bank.balance(address);
  return coins.get('uusd')!.amount;
}

export const bombay = new LCDClient(BOMBAY);
export const columbus = new LCDClient(COLUMBUS);
