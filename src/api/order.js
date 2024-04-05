import { service2 } from '@/utils/request';
export function fetchList(query) {
  return service2({
    url: '/admin/orderlist',
    method: 'post',
    data: query,
  });
}

export function retrieveOrder(query) {
  return service2({
    url: '/admin/retrieveOrder',
    method: 'post',
    data: query,
  });
}

export function orderAudit(row, auditOption) {
  return service2({
    url: '/admin/order/audit',
    method: 'post',
    data: { order: row, auditOption: auditOption },
  });
}
