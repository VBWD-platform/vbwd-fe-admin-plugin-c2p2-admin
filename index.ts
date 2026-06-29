import type { IPlugin, IPlatformSDK } from 'vbwd-view-component';

export const c2p2AdminPlugin: IPlugin = {
  name: 'c2p2-admin',
  version: '26.6',
  description:
    '2C2P admin — transactions list + refund. Config is surfaced by the core Settings → Plugins page.',

  install(sdk: IPlatformSDK) {
    sdk.addRoute({
      path: 'c2p2/transactions',
      name: 'c2p2-transactions',
      component: () => import('./src/views/C2P2Transactions.vue'),
      meta: { requiredPermission: 'payments.configure' },
    });
  },

  activate() {},
  deactivate() {},
};
