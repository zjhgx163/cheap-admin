import { service2 } from '@/utils/request';
export function fetchList(query) {
  return service2({
    url: '/admin/withdrawlist',
    method: 'post',
    data: query,
  });
}
export function getUserAccount(userId) {
  return service2({
    url: '/user/account/get/' + userId,
    method: 'post',
  });
}

export function withdrawResult(row, result) {
  return service2({
    url: '/admin/withdraw/result',
    method: 'post',
    data: { withdraw: row, result: result },
  });
}
