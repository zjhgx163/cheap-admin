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
 * 真实从数据库里删除
 * @param {*} id
 * @returns
 */
export function deleteMultipleYunpanItems(list) {
  return service2({
    url: '/admin/deleteMultipleYunpanItems',
    method: 'post',
    params: { idList: list },
    paramsSerializer: (params) => parseParams(params),
  });
}

/**
 * 软删除设置deleted=-1
 * @param {*} id
 * @returns
 */
export function removeMultipleYunpanItems(list) {
  return service2({
    url: '/admin/removeMultipleYunpanItems',
    method: 'post',
    params: { idList: list },
    paramsSerializer: (params) => parseParams(params),
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

/**
 * YunpnSpiderPage 页面list
 * @param {*} id
 * @returns
 */
export function fetchSpiderPageList(query) {
  return service2({
    url: '/admin/spiderPageList',
    method: 'post',
    data: query,
  });
}

/**
 * YunpnUneditPage 页面list
 * @param {*} id
 * @returns
 */
export function fetchUneditPageList(query) {
  return service2({
    url: '/admin/uneditPageList',
    method: 'post',
    data: query,
  });
}

function parseParams(params) {
  let options = '';

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const element of value) {
        options += `${key}=${element}&`;
      }
    } else {
      options += `${key}=${value}&`;
    }
  }

  return options.slice(0, -1);
}
