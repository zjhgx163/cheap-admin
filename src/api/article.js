import request from '@/utils/request';
import { service2 } from '@/utils/request';

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query,
  });
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id },
  });
}

export function getArticle(query) {
  return service2({
    url: '/admin/getArticle',
    method: 'post',
    data: query,
  });
}

export function submitArticle(query) {
  return service2({
    url: '/admin/submitArticle',

    method: 'post',
    data: query,
  });
}

export function delArticle(id) {
  return service2({
    url: '/admin/delArticle',
    method: 'post',
    params: { id },
  });
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv },
  });
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data,
  });
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data,
  });
}
