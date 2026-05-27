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

/** Minimal surface of the host's ``@/api`` ApiClient — promise-returning,
    already-parsed body. Each plugin types its store against this so the
    view can pass ``api`` from the host without TS complaints. */
interface ApiClientLike {
  get<T = unknown>(url: string, config?: unknown): Promise<T>;
  post<T = unknown>(url: string, body?: unknown, config?: unknown): Promise<T>;
}

export const useC2P2Store = defineStore('c2p2-admin', () => {
  const transactions = ref<C2P2Transaction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchTransactions(api: ApiClientLike) {
    loading.value = true;
    error.value = null;
    try {
      const body = await api.get<{ transactions: C2P2Transaction[] }>('/api/v1/plugins/c2p2/transactions');
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
    api: ApiClientLike,
  ) {
    return api.post(
      `/api/v1/plugins/c2p2/payments/${invoiceNo}/refund`,
      amount !== null ? { amount } : {},
    );
  }

  return { transactions, loading, error, fetchTransactions, refund };
});
