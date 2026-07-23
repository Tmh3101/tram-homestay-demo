export interface BankInfo {
  bin: string;
  shortName: string;
  name: string;
  logo: string;
  deeplink: string;
}

export const BANKS: BankInfo[] = [
  { bin: '970436', shortName: 'VCB', name: 'Vietcombank', logo: '/images/banks/vcb.svg', deeplink: 'vietcombank://pay?' },
  { bin: '970440', shortName: 'TCB', name: 'Techcombank', logo: '/images/banks/tcb.svg', deeplink: 'tcbmobile://pay?' },
  { bin: '970437', shortName: 'BIDV', name: 'BIDV', logo: '/images/banks/bidv.svg', deeplink: 'bidv://pay?' },
  { bin: '970418', shortName: 'MB', name: 'MB Bank', logo: '/images/banks/mb.svg', deeplink: 'mbbank://pay?' },
  { bin: '970405', shortName: 'VPB', name: 'VPBank', logo: '/images/banks/vpb.svg', deeplink: 'vpbank://pay?' },
  { bin: '970422', shortName: 'ACB', name: 'ACB', logo: '/images/banks/acb.svg', deeplink: 'acb://pay?' },
];

export const HOMESTAY_BANK_ACCOUNT = {
  bankBin: '970436',
  bankName: 'Vietcombank',
  accountNumber: '1234567890',
  accountName: 'NGUYEN VAN A',
};