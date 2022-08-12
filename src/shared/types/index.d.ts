export type SssToken = {
  deadline: number;
  signerAddress: string;
  iad: number;
  verifierAddress: string;
  netWork: number;
};

export type SssBody = {
  publicKey: string;
  authToken: string;
};
