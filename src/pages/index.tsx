import type { NextPage } from 'next';
import React, { useState } from 'react';

import { apiClient } from 'src/shared/lib/apiClient';
import { SssToken, SssBody } from 'src/shared/types';
import { getActiveAccountToken, getActivePublicKey } from 'sss-module';

import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  NetworkType,
  PublicAccount,
  RepositoryFactoryHttp,
  KeyGenerator,
  UInt64,
} from 'symbol-sdk';

const NODE = 'https://hideyoshi-node.net:3001';
const repo = new RepositoryFactoryHttp(NODE);
const restrictionHttp = repo.createRestrictionMosaicRepository();

const Home: NextPage = () => {
  const [message, setMessage] = useState<string>('認証準備中');
  const [ninsyoColor, setNinsyoColor] = useState<string>('white');

  let pkey = '';

  const onClickSwitchFlag = async () => {
    const init = async (): Promise<boolean> => {
      pkey = getActivePublicKey();
      const query = {
        targetAddress: PublicAccount.createFromPublicKey(
          pkey,
          NetworkType.MAIN_NET,
        ).address,
      };
      const res = await restrictionHttp.search(query).toPromise();
      if (res == undefined) return false;
      if (res.data.length == 0) return false;

      for (let i = 0; i < res.data[0].restrictions.length; i++) {
        if (
          res.data[0].restrictions[i].key.toHex() ==
            KeyGenerator.generateUInt64Key('TOMATO').toHex() &&
          res.data[0].restrictions[i].restrictionValue.toHex() ==
            UInt64.fromUint(1).toHex()
        ) {
          return true;
        }
      }
      return false;
    };

    const checkMosaic = await init();
    if (checkMosaic) {
      setMessage('すでに認証されています');
      return;
    }

    const customPayload = {
      deadline: 60 * 60 * 24,
    };
    const authPubkey =
      'A39EA1EEA2BF80902ED5B573FC9DEE1EDF53FB6E05099669743DFA3E8233400E';

    getActiveAccountToken(authPubkey, customPayload).then(async function (
      token,
    ) {
      try {
        const data: SssBody = {
          authToken: token,
          publicKey: pkey,
        };
        const response = await apiClient.post<[SssToken, string]>(
          '/api/sss-token',
          data,
        );
        if (typeof response.data == 'string') {
          setNinsyoColor('red');
          setMessage(response.data);
        } else {
          setNinsyoColor('blue');
          setMessage('認証中');

          const hash: string = response.data[1];
          const data = {
            hash,
          };
          const message = await apiClient.post<string>(
            '/api/watch-transaction',
            data,
          );
          setNinsyoColor('green');
          setMessage(message.data);
        }
      } catch (e: any) {
        console.error(e);
      }
    });
  };
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>toshi.tomato を手に入れる方法</h1>
      <Box component='span' m={1}>
        <Card
          sx={{ minWidth: 275 }}
          variant='outlined'
          style={{
            background: '#0b1929',
            border: '1px solid rgba(255, 255, 255, 1)',
            color: 'white',
          }}
        >
          <CardContent>
            <Typography
              variant='h5'
              component='div'
              style={{ paddingBottom: '16px' }}
            >
              はじめに
            </Typography>
            <Typography variant='body2' py={3}>
              本企画では、Symbolのデフォルト機能、グローバルモザイク制限というものを使用しています。
              <br />
              <a
                href='https://github.com/xembook/quick_learning_symbol/blob/main/11_restriction.md#112-%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E3%83%A2%E3%82%B6%E3%82%A4%E3%82%AF%E5%88%B6%E9%99%90'
                target='_blank'
                style={{ color: '#6be4f9' }}
              >
                グローバルモザイク制限について
              </a>
              <br />
              <br />
              toshi.tomatoはこのグローバルモザイク制限を受けており、誰でも送受信できるモザイクではありません。具体的にはTOMATOというKeyの値が1でなければいけません。これはn以上やm未満、lではない。などの設定を行うことができます。
              <br />
              また、このモザイクの生成アカウントが他アカウントの署名無しにトランザクションによって値を付与することができます。今回のケースではSSSでxembook.tomatoの所有が確認できたアカウントに対してTOMATOを1にするトランザクションをアナウンスします。
              <br />
              これをうまく活用すれば会員のみが送受信できる限定モザイクや、魔術師レベルが10になった時だけ使用できる魔法をモザイクで表現など、色々なアイデアが考えられると思います。Symbolの活用方法を考えるのは楽しいので、まずは速習Symbolで学習してみてください。
              <br />
              <a
                href='https://github.com/xembook/quick_learning_symbol/'
                target='_blank'
                style={{ color: '#6be4f9' }}
              >
                速習Symbolはこちら
              </a>
              <br />
              それでは早速、グローバルモザイク制限を受けたモザイク[toshi.tomato]を入手して体感してみてください。
            </Typography>
            <Typography variant='h5' component='div'>
              STEP1: [mosaic] xembook.tomatoを入手してください
            </Typography>
            <Typography variant='body2' py={3}>
              Twitter界隈で探してみてください。多分誰かが持ってたり投げ合ったりしてるはず。
            </Typography>
            <Typography variant='h5' component='div'>
              STEP2: SSS認証
            </Typography>
            <Typography variant='body2' py={3}>
              このURLをSSSで有効化(Link to
              SSS)し、ページ最下部のSSS認証をクリックしてSSSでxembook.tomatoを所有していることを証明してください。
              <br />
              確実に所有を証明するため、SSS
              Extensionの機能であるgetActiveAccountTokenを使用しています。
              <br />
              <a
                href='https://docs.sss-symbol.com/DevelopperGuide/Encription/'
                target='_blank'
                style={{ color: '#6be4f9' }}
              >
                https://docs.sss-symbol.com/DevelopperGuide/Encription/
              </a>
              <br />
            </Typography>
            <Typography variant='h5' component='div'>
              STEP3: Transactionの承認を待つ
            </Typography>
            <Typography variant='body2' py={3}>
              xembook.tomatoの所有が確認されたらtoshi.tomatoの送受信権利を得るためのトランザクションが送信されます。下部の「承認中」が「承認完了」になるまでお待ち下さい。（だいたい30秒ぐらい）
              <br />
              <b>
                ※注意事項
                <br />
                こちらで承認を受けると
                <a
                  href='https://twitter.com/ishidad2'
                  target='_blank'
                  style={{ color: '#00ff18' }}
                >
                  だいさん
                </a>
                が作成された
                <a
                  href='https://ishidad2.github.io/2022-tomatina/'
                  target='_blank'
                  style={{ color: '#00ff18' }}
                >
                  トマティーナ Monitor
                </a>
                にtoshi.tomatoの未保有者アドレスが表示されます。予め了承ください。
              </b>
            </Typography>
            <Typography variant='h5' component='div'>
              STEP4: toshi.tomatoの入手
            </Typography>
            <Typography variant='body2' py={3}>
              このトランザクションにはtoshi.tomatoを送信するトランザクションは含まれていません。実は、アグリゲートトランザクションを使用すればかんたんに送信するトランザクションを混ぜることはできるのですが、それは面白くないのでやめました。
              <br />
              Twitter界隈で所有している人を探してその人とやりとりして入手するのが面白いなーと思ってます。だって、その人は送受信権利を持っているので、この機能を試すにはぴったりかと。
              <br />
              とは言え、もちろん最初は僕以外誰も持っていませんし、どうしても見つからない場合もあると思います。そんな場合は以下Twitterアカウントに連絡ください。たぶん、トマティーナ当日は何かしらTweetしてるのでそのTweetへのリプやリツイートが良いです。拡がったほうが面白いのでリツイートがいいかな。
              <br />
              <a
                href='https://twitter.com/toshiya_ma'
                target='_blank'
                style={{ color: '#6be4f9' }}
              >
                twitterはこちら
              </a>
              <br />
              このtoshi.tomatoはトマティーナでしか配らない希少性の高いモザイクなのでぜひGETしてみてください。
            </Typography>
            <Typography variant='h5' component='div'>
              STEP5: toshi.tomatoを投げる
            </Typography>
            <Typography variant='body2' py={3}>
              無事入手することができたら、今度は同じように認証を受けた人と送受信してみましょう。繰り返しますが認証を受けていなければ送信どころか受信すらできないモザイクです。すでに認証を受けたあなたはこのモザイクを送受信する権利を得ました。同じように送受信権利を獲たアドレスにこのtoshi.tomatoを投げつけてみましょう。
              <br />
              なお、以下の
              <a
                href='https://twitter.com/ishidad2'
                target='_blank'
                style={{ color: '#00ff18' }}
              >
                だいさん
              </a>
              が作成された
              <a
                href='https://ishidad2.github.io/2022-tomatina/'
                target='_blank'
                style={{ color: '#00ff18' }}
              >
                トマティーナ Monitor
              </a>
              には、認証され、toshi.tomatoの未保有者アドレス一覧が記載されています。未保有者アドレスを見つけたら率先して投げつけてあげたらありがたいです。
              <br />
              <br />
              また、本企画はxembookさん主催のxembook.tomatoを投げ合うトマティーナの派生イベントです。本家イベントでも思いっきり投げ合いましょう。
            </Typography>
            <Typography variant='h5' component='div'>
              HINT: 簡単にトマトを投げ合う方法
            </Typography>
            <Typography variant='body2' py={3}>
              以下のGoogleChrome拡張のNFT-DriveEXをインストールすると、WEB上にアドレスかネームスペースがあればChromeで簡単にモザイクを投げつける事ができます。
              <br />
              <a
                href='https://chrome.google.com/webstore/search/NFTDriveEX?hl=ja'
                target='_blank'
                style={{ color: '#6be4f9' }}
              >
                https://chrome.google.com/webstore/search/NFTDriveEX?hl=ja
              </a>
              <br />
            </Typography>
          </CardContent>
        </Card>
        <Box style={{ margin: '50px auto', width: '500px' }}>
          <Button
            style={{ width: '500px' }}
            variant='contained'
            color='secondary'
            startIcon={<EnhancedEncryptionIcon />}
            onClick={onClickSwitchFlag}
          >
            SSS認証
          </Button>
          <Card
            className='blinking'
            sx={{ width: 500 }}
            variant='outlined'
            style={{
              margin: '50px auto',
              background: '#0b1929',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 1)',
              borderColor: ninsyoColor,
              color: ninsyoColor,
              borderRadius: '0',
            }}
          >
            <CardContent>
              <Typography variant='h5' component='div'>
                {message}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
