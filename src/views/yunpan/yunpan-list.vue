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
          修改状态：
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
          <img :src="scope.row.confusedAvatar" />
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

      <el-table-column align="center" label="标识" width="60" show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.dataId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.tag }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160" align="center" label="链接" show-overflow-tooltip="false">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.yunpanLinks"
            placement="top-start"
          >
            <span>{{ scope.row.yunpanLinks }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="编辑状态" width="80">
        <template slot-scope="{ row }">
          <el-tag :type="row.editStatus | editStatusFilter" effect="dark">
            {{ row.editStatus | parseEditStatus }}
          </el-tag>
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
      <el-table-column align="center" width="100" label="编辑">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>

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

export default {
  name: 'Yunpan',
  components: { Pagination },
  filters: {
    //上面的parseTime也是filter
    editStatusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'warning',
        2: '',
        3: 'success',
      };
      return statusMap[status];
    },
    parseEditStatus(status) {
      const statusMap = {
        0: '未编辑',
        1: 'gpt编辑',
        2: '人工编辑',
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

    edit(row) {
      if (row.approveOption == -1) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(({ value }) => {
            row.remark = value;
            orderAudit(row, row.approveOption).then((response) => {
              console.log('code = ' + response.data.code);
              if (response.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '审核成功: 拒绝' + value,
                });
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: '审核失败: 拒绝' + value,
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入',
            });
          });
      } else {
        if (row.actualCommissionAmount > 0) {
          if (row.finalCommissionAmount == undefined || row.finalCommissionAmount == '') {
            this.$message({
              type: 'error',
              message: '最终佣金不能为空',
            });
            return;
          }
          if (row.userFinalCommissionAmount == undefined || row.userFinalCommissionAmount == '') {
            this.$message({
              type: 'error',
              message: '用户最终佣金不能为空',
            });
            return;
          }
        }

        orderAudit(row, row.approveOption).then((response) => {
          console.log('code = ' + response.data.code);
          if (response.data.code == 0) {
            this.$message({
              type: 'success',
              message: '审核成功: 同意',
            });
            this.getList();
          } else {
            this.$message({
              type: 'error',
              message: '审核失败: 同意',
            });
          }
        });
      }
    },
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
          label: '未修改',
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
