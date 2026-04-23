import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface C2P2Transaction {
  id: string;
  invoice_no: string;
  merchant_id: string;
  payment_token: string | null;
  tran_ref: string | null;
  amount: string;
  currency: string;
  channel_code: string | null;
  status: string;
  last_resp_code: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useC2P2Store = defineStore('c2p2-admin', () => {
  const transactions = ref<C2P2Transaction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchTransactions(api: { get: typeof fetch }) {
    loading.value = true;
    error.value = null;
    try {
      const resp = await api.get('/api/v1/plugins/c2p2/transactions');
      const body = await resp.json();
      transactions.value = body.transactions || [];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load';
    } finally {
      loading.value = false;
    }
  }

  async function refund(
    invoiceNo: string,
    amount: number | null,
    api: {
      post: (url: string, body: unknown) => Promise<Response>;
    },
  ) {
    const resp = await api.post(
      `/api/v1/plugins/c2p2/payments/${invoiceNo}/refund`,
      amount !== null ? { amount } : {},
    );
    if (!resp.ok) {
      throw new Error(`refund failed: ${resp.status}`);
    }
    return resp.json();
  }

  return { transactions, loading, error, fetchTransactions, refund };
});
