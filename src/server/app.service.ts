import { Injectable } from '@nestjs/common';
import { SssToken } from 'src/shared/types';
import {
  NetworkType,
  PublicAccount,
  EncryptedMessage,
  Account,
  MosaicAddressRestrictionTransaction,
  Deadline,
  MosaicId,
  KeyGenerator,
  UInt64,
  RepositoryFactoryHttp,
} from 'symbol-sdk';
import { SssBody } from '../shared/types';

@Injectable()
export class AppService {
  async getSssToken(sssBody: SssBody): Promise<SssToken> {
    try {
      const NODE = 'https://hideyoshi-node.net:3001';
      const repo = new RepositoryFactoryHttp(NODE);
      const txRepo = repo.createTransactionRepository();
      const accRepo = repo.createAccountRepository();
      const nt = NetworkType.MAIN_NET;
      const epochAdjustment = 1615853185;
      const generationHash =
        '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
      const user = PublicAccount.createFromPublicKey(sssBody.publicKey, nt);
      const msg = new EncryptedMessage(sssBody.authToken, user);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const privateKey = process.env.ADMIN_PRIVATEKEY!;
      const verifier = Account.createFromPrivateKey(privateKey, nt);
      const token = verifier.decryptMessage(msg, user).payload;
      const json: SssToken = JSON.parse(token);
      if (json.verifierAddress == verifier.address.plain()) {
        const accInfo = await accRepo.getAccountInfo(user.address).toPromise();
        if (!accInfo) throw new Error('nothing account info');
        for (let i = 0; i < accInfo.mosaics.length; i++) {
          if (accInfo.mosaics[i].id.id.toHex() == '310378C18A140D1B') {
            const resTx = MosaicAddressRestrictionTransaction.create(
              Deadline.create(epochAdjustment),
              new MosaicId('613E6D0FC11F4530'),
              KeyGenerator.generateUInt64Key('TOMATO'),
              user.address,
              UInt64.fromUint(1),
              nt,
              UInt64.fromHex('FFFFFFFFFFFFFFFF'),
            ).setMaxFee(100);
            const signedTx = verifier.sign(resTx, generationHash);
            const result = await txRepo.announce(signedTx).toPromise();
            console.log(result);
            return json;
          }
        }
        throw new Error('you do not have the mosaic');
      } else {
        throw new Error('does not match verifierAddress');
      }
    } catch (e: any) {
      return e.message;
    }
  }
}
