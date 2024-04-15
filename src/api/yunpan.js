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
export function moveYunpanItem(id, validStatus) {
  return service2({
    url: '/admin/moveYunpanItem',
    method: 'post',
    params: { id: id, validStatus: validStatus },
  });
}

/**
 * 由于版权方要求暂时下架
 * @param {*} id
 * @returns
 */
export function removeYunpanItem(id, validStatus) {
  return service2({
    url: '/admin/removeYunpanItem',
    method: 'post',
    params: { id: id, validStatus: validStatus },
  });
}
/**
 * 真实从数据库里删除
 * @param {*} id
 * @returns
 */
export function deleteYunpanItem(id, validStatus) {
  return service2({
    url: '/admin/deleteYunpanItem',
    method: 'post',
    params: { id: id, validStatus: validStatus },
  });
}
/**
 *
 * @param {*} submitVo
 * @returns
 */
export function batchDeleteYunpanItems(submitVo) {
  return service2({
    url: '/admin/batchDeleteYunpanItems',
    method: 'post',
    data: submitVo,
  });
}

/**
 * 把yunpanItem item设置为失效
 * @param {*} id
 * @returns
 */
export function makeInvalid(id) {
  return service2({
    url: '/admin/makeYunpanInvalid',
    method: 'post',
    params: { id: id },
  });
}

/**
 * 把yunpanItemInvalid item设置为有效
 * @param {*} id
 * @returns
 */
export function makeValid(id) {
  return service2({
    url: '/admin/makeYunpanValid',
    method: 'post',
    params: { id: id },
  });
}

export function getCompareYunpanItems(query) {
  return service2({
    url: '/admin/getCompareYunpanItems',
    method: 'post',
    data: query,
  });
}

export function replaceYunpanLinks(myLinks, queryArray) {
  return service2({
    url: '/admin/replaceYunpanLinks',
    method: 'post',
    data: { myLinks: myLinks, yunpanItems: queryArray },
  });
}
