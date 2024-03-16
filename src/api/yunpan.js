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
export function fetchAuthorInfo(id) {
  return service2({
    url: '/admin/getYunpanFakeUserInfo',
    method: 'post',
    params: { id },
  });
}

/**
 * 由于adsense收到report，需要把被report到的item换个ID
 * @param {*} id
 * @returns
 */
export function moveYunpnItem(id, validStatus) {
  return service2({
    url: '/admin/moveYunpnItem',
    method: 'post',
    params: { id: id, validStatus: validStatus },
  });
}

/**
 * 由于版权方要求暂时下架
 * @param {*} id
 * @returns
 */
export function removeYunpanItem(id) {
  return service2({
    url: '/admin/removeYunpanItem',
    method: 'post',
    params: { id },
  });
}
/**
 * 真实从数据库里删除
 * @param {*} id
 * @returns
 */
export function delYunpanItem(id, validStatus) {
  return service2({
    url: '/admin/delYunpanItem',
    method: 'post',
    params: { id: id, validStatus: validStatus },
  });
}
