import type { NextPage } from 'next';
import React, { useState } from 'react';

import { apiClient } from 'src/shared/lib/apiClient';
import { SssToken, SssBody } from 'src/shared/types';
import { getActiveAccountToken, getActivePublicKey } from 'sss-module';

import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type HomeProps = {
  token: SssToken;
};

const Home: NextPage = (props) => {
  const [message, setMessage] = useState<string>('');
  const [ninsyo, setNinsyo] = useState<string>('認証準備中');
  const onClickSwitchFlag = async () => {
    const customPayload = {
      deadline: 60 * 60 * 24,
    };
    const pubkey = getActivePublicKey();
    const reciepientPubkey =
      'A39EA1EEA2BF80902ED5B573FC9DEE1EDF53FB6E05099669743DFA3E8233400E';

    getActiveAccountToken(reciepientPubkey, customPayload).then(async function (
      token,
    ) {
      try {
        const data: SssBody = {
          authToken: token,
          publicKey: pubkey,
        };
        const response = await apiClient.post<SssToken>('/api/sss-token', data);
        console.log(typeof response.data);
        if (typeof response.data == 'string') {
          setMessage(response.data);
        }
        console.log(response.data);
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
            </Typography>
            <Typography variant='h5' component='div'>
              STEP3: Transactionの承認を待つ
            </Typography>
            <Typography variant='body2' py={3}>
              xembook.tomatoの所有が確認されたらtoshi.tomatoの送受信権利を得るためのトランザクションが送信されます。下部の「承認中」が「承認完了」になるまでお待ち下さい。（だいたい30秒ぐらい）
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
            <Card
              className='blinking'
              sx={{ width: 500 }}
              variant='outlined'
              style={{
                margin: '50px auto',
                background: '#0b1929',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 1)',
                color: 'white',
                borderRadius: '0',
              }}
            >
              <CardContent>
                <Typography variant='h5' component='div'>
                  {ninsyo}
                </Typography>
              </CardContent>
            </Card>
            <Typography
              variant='h5'
              component='div'
              style={{ paddingBottom: '16px' }}
            >
              何がSymbol的？？
            </Typography>
            <Typography variant='body2' py={3}>
              Symbolのデフォルト機能、グローバルモザイク制限というものを使用しています。
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
              また、このモザイクの生成アカウントが他アカウントの署名無しにトランザクションによって値を付与することができます。今回のケースではSSSでxembook.tomatoの所有が確認できたアカウントに対してTOMATOを1にするトランザクションをアナウンスしました。
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
            </Typography>
          </CardContent>
        </Card>
        <Box style={{ margin: '50px auto', width: '500px' }}>
          <Button
            style={{ width: '500px' }}
            variant='contained'
            color='secondary'
            startIcon={<EnhancedEncryptionIcon />}
            //onClick={onClickSwitchFlag}
          >
            SSS認証(トマティーナ当日以外は何も起こらないよ)
          </Button>
        </Box>
      </Box>
      <div>{message}</div>
    </div>
  );
};

export default Home;
