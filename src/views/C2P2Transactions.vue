<template>
  <div class="c2p2-transactions">
    <header class="c2p2-transactions__header">
      <h2>{{ $t('c2p2Admin.transactions.title') }}</h2>
    </header>

    <div v-if="loading" class="c2p2-transactions__loading">
      {{ $t('c2p2Admin.transactions.loading') }}
    </div>

    <div v-else-if="error" class="c2p2-transactions__error">
      {{ error }}
    </div>

    <table v-else-if="transactions.length > 0" class="c2p2-transactions__table">
      <thead>
        <tr>
          <th>{{ $t('c2p2Admin.transactions.invoiceNo') }}</th>
          <th>{{ $t('c2p2Admin.transactions.amount') }}</th>
          <th>{{ $t('c2p2Admin.transactions.status') }}</th>
          <th>{{ $t('c2p2Admin.transactions.tranRef') }}</th>
          <th>{{ $t('c2p2Admin.transactions.channel') }}</th>
          <th>{{ $t('c2p2Admin.transactions.createdAt') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in transactions" :key="tx.id">
          <td>{{ tx.invoice_no }}</td>
          <td>{{ tx.amount }} {{ tx.currency }}</td>
          <td>
            <span :class="['status', `status--${tx.status}`]">{{ tx.status }}</span>
          </td>
          <td>{{ tx.tran_ref || '—' }}</td>
          <td>{{ tx.channel_code || '—' }}</td>
          <td>{{ formatDate(tx.created_at) }}</td>
          <td>
            <button
              v-if="tx.status === 'completed'"
              class="btn btn--refund"
              @click="onRefund(tx)"
            >
              {{ $t('c2p2Admin.transactions.refund') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="c2p2-transactions__empty">
      {{ $t('c2p2Admin.transactions.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, storeToRefs } from 'vue';
import { useC2P2Store, type C2P2Transaction } from '../stores/c2p2';
import { api } from '@/api';

const store = useC2P2Store();
const { transactions, loading, error } = storeToRefs(store);

onMounted(() => {
  store.fetchTransactions(api);
});

async function onRefund(tx: C2P2Transaction) {
  try {
    await store.refund(tx.invoice_no, null, api);
    await store.fetchTransactions(api);
  } catch (e) {
    window.alert(e instanceof Error ? e.message : 'refund failed');
  }
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}
</script>

<style scoped>
.c2p2-transactions {
  padding: 1.5rem;
}
.c2p2-transactions__table {
  width: 100%;
  border-collapse: collapse;
}
.c2p2-transactions__table th,
.c2p2-transactions__table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--vbwd-color-border, #e5e5e5);
  text-align: left;
}
.status--completed { color: var(--vbwd-color-success, #2a7); }
.status--failed { color: var(--vbwd-color-danger, #b22); }
.status--pending,
.status--processing { color: var(--vbwd-color-muted, #888); }
</style>
