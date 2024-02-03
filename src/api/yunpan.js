import { service2 } from '@/utils/request';
export function fetchList(query) {
  return service2({
    url: '/admin/yunpanlist',
    method: 'post',
    data: query,
  });
}
