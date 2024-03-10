import { service2 } from '@/utils/request';
export function fetchList(query) {
  return service2({
    url: '/admin/yunpanlist',

    method: 'post',
    data: query,
  });
}
export function fetchRandomAutherList() {
  return service2({
    url: '/admin/randomAutherList',
    method: 'get',
  });
}
export function submitArticle(query) {
  return service2({
    url: '/admin/submitArticle',

    method: 'post',
    data: query,
  });
}
