<template>
  <div>
    <el-row :gutter="1" style="margin: 40px 15px 40px">
      <el-col :span="7" :xs="24">
        <div class="block">
          日期选择：
          <el-date-picker
            v-model="listQuery.dateRange"
            :placeholder="$t('order.datePlaceholder')"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </el-col>

      <el-col :span="5" :xs="24">
        <div class="block">
          爬取/自有：
          <el-select v-model="listQuery.source" clearable placeholder="请选择">
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>

      <el-col :span="5" :xs="24">
        <div class="block">
          编辑状态：
          <el-select v-model="listQuery.editStatus" clearable placeholder="请选择">
            <el-option
              v-for="item in editStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>

      <el-col :span="5" :xs="24">
        <div class="block">
          有效状态：
          <el-select v-model="listQuery.validStatus" clearable placeholder="请选择">
            <el-option
              v-for="item in validStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="1" style="margin: 40px 15px 40px">
      <el-col :span="5" :xs="24">
        <div class="block">
          搜索引擎：
          <el-select v-model="listQuery.searchEngineCrawled" clearable placeholder="请选择">
            <el-option
              v-for="item in searchEngineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :span="6" :xs="24">
        <div class="block">
          输入ID：
          <el-input v-model="listQuery.id" placeholder="ID" style="width: 300px; max-width: 100%" />
        </div>
      </el-col>

      <el-col :span="6" :xs="24">
        <div class="block">
          关键字：
          <el-input
            v-model="listQuery.keyword"
            placeholder="搜索关键字"
            style="width: 300px; max-width: 100%"
          />
        </div>
      </el-col>

      <el-col :span="4" :xs="24">
        <div class="block">
          <el-button type="primary" @click.prevent.stop="getList"> 查询 </el-button>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="1" style="margin: 40px 15px 40px">
      <el-col :span="6" :xs="24">
        <div class="block">
          替换链接
          <el-input
            v-model="listQuery.keyword"
            placeholder="替换链接"
            style="width: 300px; max-width: 100%"
          />
        </div>
      </el-col>

      <el-col :span="4" :xs="24">
        <div class="block">
          <el-button type="primary" @click.prevent.stop="replaceLinks"> 执行 </el-button>
        </div>
      </el-col></el-row
    >

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      tooltip-effect="light"
      fit
      highlight-current-row
      style="width: 100%"
      stripe
    >
      <el-table-column type="selection" width="40"> </el-table-column>

      <el-table-column width="170" align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题" width="170">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top-start">
            <a :href="'https://www.hjdang.com/d/' + scope.row.id" class="link-type">
              {{ scope.row.title }}</a
            >
          </el-tooltip>

          <!-- <router-link v-slot="{ href,navigate }"  to="/about">
 
          </router-link> -->
        </template>
      </el-table-column>

      <el-table-column align="center" label="修改过的标题" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.titleGpt }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像" width="75">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column align="center" label="楼主" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.auther }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="混淆头像" width="85">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.confusedAvatar"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column align="center" label="混淆楼主" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.confusedAuther }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="来源" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标识" width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.dataId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.tag }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="编辑状态" width="150">
        <template slot-scope="{ row }">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="12">
              <el-tag :type="row.editStatus | editStatusFilter" size="small" effect="dark">
                {{ row.editStatus | parseEditStatus }}
              </el-tag>
            </el-col>
            <el-col :span="12">
              <router-link
                :to="{
                  path: '/manage/article/' + row.id,
                  query: { type: 'yunpan', isEdit: true, validStatus: listQuery.validStatus },
                }"
              >
                <el-button type="text" size="mini" icon="el-icon-edit">
                  编辑
                </el-button></router-link
              >
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="140">
        <template slot-scope="{ row }">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="8">
              <el-button
                type="primary"
                circle
                size="mini"
                icon="el-icon-remove"
                @click="move(row.id)"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                type="warning"
                circle
                size="mini"
                icon="el-icon-delete"
                @click="remove(row.id)"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                type="danger"
                circle
                size="mini"
                icon="el-icon-delete-solid"
                @click="del(row.id)"
              />
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column width="160" align="center" label="链接" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="
              scope.row.yunpanLinks != null
                ? scope.row.yunpanLinks.toString()
                : scope.row.yunpanLinks
            "
            placement="top-start"
          >
            <span>{{ scope.row.yunpanLinks }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.approveOption"
            placeholder="请选择"
            :disabled="scope.row.status == 1"
          >
            <el-option
              v-for="item in approveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column> -->

      <el-table-column width="140" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.itemCreateDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140" align="center" label="最后回帖时间">
        <template slot-scope="scope">
          <span>{{ scope.row.lastPostDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!-- 
      <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon
            v-for="n in +scope.row.importance"
            :key="n"
            icon-class="star"
            class="meta-item__icon"
          />
        </template>
      </el-table-column>
      

      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{ row }">
          <router-link :to="'/example/edit/' + row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit"> Edit </el-button>
          </router-link>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList } from '@/api/yunpan';
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import { moveYunpnItem, removeYunpnItem, delYunpanItem } from '@/api/yunpan';

export default {
  name: 'Yunpan',
  components: { Pagination },
  filters: {
    //上面的parseTime也是filter
    editStatusFilter(status) {
      const statusMap = {
        0: 'error',
        1: 'warning',
        2: 'info',
        3: 'success',
      };
      return statusMap[status];
    },
    parseEditStatus(status) {
      const statusMap = {
        0: '未编辑',
        1: 'gpt编辑1',
        2: 'gpt编辑2',
        3: '人工编辑',
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        source: 0,
        validStatus: 1,
        editStatus: 0,
        searchEngineCrawled: 0,
        dateRange: null,
        id: '',
        keyword: '',
      },
      sourceOptions: [],
      editStatusOptions: [],
      validStatusOptions: [],
      searchEngineOptions: [],
      approveOptions: [
        {
          value: -1,
          label: '拒绝',
        },
        {
          value: 1,
          label: '同意',
        },
      ],
    };
  },
  created() {
    this.setOptions(); // set default select options
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        console.log('records = ', response.data.data.records);
        this.list = response.data.data.records;
        this.total = Number(response.data.data.total);
        this.listLoading = false;
      });
    },
    /**
     * 由于adsense收到report，需要把被report到的item换个ID
     * @param {*} id
     * @returns
     */
    move(id) {
      this.$confirm('此操作会改变此云盘资源id, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          moveYunpnItem(id, this.listQuery.validStatus).then((response) => {
            if (response.data.code == 0) {
              this.$message({
                type: 'success',
                message: '移动成功 - ' + response.data.data,
              });
            } else {
              this.$message({
                type: 'error',
                message: '移动失败：' + response.data.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移动',
          });
        });
    },
    /**
     * 由于版权方要求暂时下架
     * @param {*} id
     * @returns
     */
    remove(id) {},
    /**
     * 真实从数据库里删除
     * @param {*} id
     * @returns
     */
    del(id) {},
    inputFinalCommissionAmount(row) {
      if (row.finalCommissionAmount > 0) {
        let userFinalCommissionAmount = (row.finalCommissionAmount * row.shareRate) / 100;
        row.userFinalCommissionAmount = userFinalCommissionAmount.toFixed(2);
      }
    },

    setOptions() {
      this.sourceOptions = [
        {
          value: 0,
          label: '全部',
        },
        {
          value: 1,
          label: 'self',
        },

        {
          value: 2,
          label: 'crawled',
        },
      ];
      this.editStatusOptions = [
        {
          value: 0,
          label: '未编辑',
        },
        {
          value: 1,
          label: '标题由gpt编辑',
        },

        {
          value: 2,
          label: '内容由gpt编辑',
        },

        {
          value: 3,
          label: '人工编辑',
        },
      ];
      this.validStatusOptions = [
        {
          value: -1,
          label: '失效',
        },
        {
          value: 1,
          label: '有效',
        },
      ];
      this.searchEngineOptions = [
        { value: 0, label: 'All' },
        {
          value: 1,
          label: 'baidu',
        },
        {
          value: 2,
          label: 'google',
        },
        {
          value: 3,
          label: 'bing',
        },
        {
          value: 4,
          label: 'sogou',
        },
        {
          value: 5,
          label: 'shenma',
        },
      ];
    },
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
