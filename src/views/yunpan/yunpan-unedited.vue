<template>
  <div>
    <el-row :gutter="1" style="margin: 40px 15px 40px">
      <el-col :span="4" :xs="24">
        <div class="block">
          来源网站：
          <el-select
            v-model="listQuery.sourceSite"
            clearable
            placeholder="请选择"
            style="max-width: 50%"
          >
            <el-option
              v-for="item in sourceSiteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :span="3" :xs="24">
        <div class="block">
          状态：
          <el-select
            v-model="listQuery.status"
            clearable
            placeholder="请选择"
            style="max-width: 60%"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
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

      <el-col :span="4" :xs="24">
        <div class="block">
          Key：
          <el-input v-model="listQuery.keyword" placeholder="keyword" style="max-width: 70%" />
        </div>
      </el-col>

      <el-col :span="4" :xs="24">
        <div class="block">
          作者：
          <el-input v-model="listQuery.auther" placeholder="作者" style="max-width: 70%" />
        </div>
      </el-col>

      <el-col :span="1" :xs="24">
        <div class="block">
          <el-button type="primary" @click.prevent.stop="getList"> 查询 </el-button>
        </div>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      tooltip-effect="light"
      fit
      highlight-current-row
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="40"> </el-table-column>

      <el-table-column width="170" align="center" label="ID" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="来源网站" width="90" prop="sourceSite">
        <template slot-scope="scope">
          {{ scope.row.source }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter" size="mini" effect="light">
            {{ scope.row.status | parseStatus }}
          </el-tag>
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

      <el-table-column class-name="status-col" label="编辑状态" width="190">
        <template slot-scope="{ row }">
          <el-row type="flex" justify="space-between" align="middle" :gutter="3">
            <el-col :span="8">
              <el-tag :type="row.editStatus | editStatusFilter" size="mini" effect="dark">
                {{ row.editStatus | parseEditStatus }}
              </el-tag>
            </el-col>
            <el-col :span="8">
              <router-link
                :to="{
                  path: '/manage/article/' + row.id,
                  query: {
                    type: 'yunpan',
                    isEdit: true,
                    validStatus: 1,
                    editStatus: row.editStatus,
                  },
                }"
              >
                <el-button type="text" size="mini" icon="el-icon-edit">
                  编辑
                </el-button></router-link
              >
            </el-col>
            <!-- ${row.id} -->
            <!-- -->
            <el-col :span="8">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                :disabled="row.editStatus < 2"
                @click="
                  $router.push({
                    path: '/yunpan/diff/' + row.id,
                    query: { validStatus: 1, editStatus: row.editStatus },
                  })
                "
              >
                对比
              </el-button>
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
            <a class="link-type"> {{ scope.row.yunpanLinks }}</a>
            <!-- <span>{{ scope.row.yunpanLinks }}</span> -->
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="140" align="center" label="爬取时间" prop="lastUpdateDate">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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

      <el-table-column align="center" label="标签" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.tag }}</span>
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
                @click="move(row)"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                type="warning"
                circle
                size="mini"
                icon="el-icon-delete"
                @click="remove(row)"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                type="danger"
                circle
                size="mini"
                icon="el-icon-delete-solid"
                @click="del(row)"
              />
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="使有效/失效" width="100">
        <template slot-scope="{ row }">
          <el-row type="flex" justify="space-around" align="middle">
            <el-col :span="8">
              <el-button
                type="info"
                circle
                size="mini"
                icon="el-icon-document-remove"
                @click="makeInvalid(row)"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                type="success"
                circle
                size="mini"
                icon="el-icon-document-add"
                @click="makeValid(row)"
              />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
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
import { fetchUneditPageList } from '@/api/yunpan';
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import {
  moveYunpanItem,
  removeYunpanItem,
  deleteYunpanItem,
  makeInvalid,
  makeValid,
} from '@/api/yunpan';

export default {
  name: 'Yunpan',
  components: { Pagination },
  filters: {
    //上面的parseTime也是filter
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'info',
        2: 'warning',
        3: 'danger',
        '-1': '',
      };
      return statusMap[status];
    },
    parseStatus(status) {
      const statusMap = {
        0: '正式展现',
        1: '内容不足',
        2: '没有链接',
        3: 'title未修改',
        '-1': '草稿',
      };
      return statusMap[status];
    },
    //上面的parseTime也是filter
    editStatusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'warning',
        2: '',
        3: 'success',
        '-1': 'info',
      };
      return statusMap[status];
    },
    parseEditStatus(status) {
      const statusMap = {
        0: '未编辑',
        1: 'gpt编辑1',
        2: 'gpt编辑2',
        3: '人工编辑',
        '-1': 'gpt编辑失败',
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
        limit: 50,
        validStatus: 1,
        status: -1,
        sourceSite: 'pan666',
        dateRange: null,
        keyword: '',
        auther: '',
      },
      statusOptions: [],
      sourceSiteOptions: [],
      loading: false,
      multipleSelection: [],
    };
  },
  props: {
    status: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
    },
  },
  created() {
    this.setOptions(); // set default select options
    if (this.status != null && !isNaN(this.status)) {
      this.listQuery.status = this.status;
    }

    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchUneditPageList(this.listQuery).then((response) => {
        console.log('records = ', response.data.data.records);
        this.list = response.data.data.records;
        this.total = Number(response.data.data.total);
        this.listLoading = false;
        // this.listQuery.sort = '';
      });
    },
    /**
     * 由于adsense收到report，需要把被report到的item换个ID
     * @param {*} id
     * @returns
     */
    move(row) {
      this.$confirm('此操作会改变此云盘资源:' + row.title + '的id, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          moveYunpanItem(row.id, 1).then((response) => {
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
    remove(row) {
      this.$confirm('此操作会移除此云盘资源:' + row.title + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          removeYunpanItem(row.id, 1).then((response) => {
            if (response.data.code == 0) {
              this.$message({
                type: 'success',
                message: '移除成功 - ' + response.data.data,
              });
            } else {
              this.$message({
                type: 'error',
                message: '移除失败：' + response.data.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移除',
          });
        });
    },
    /**
     * 真实从数据库里删除
     * @param {*} id
     * @returns
     */
    del(row) {
      this.$confirm('此操作会删除此云盘资源:' + row.title + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteYunpanItem(row.id, 1).then((response) => {
            if (response.data.code == 0) {
              this.$message({
                type: 'success',
                message: '删除成功 - ' + response.data.data,
              });
            } else {
              this.$message({
                type: 'error',
                message: '删除失败：' + response.data.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },

    makeInvalid(row) {
      this.$confirm('此操作会使此资源处于失效:' + row.title + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          makeInvalid(row.id).then((response) => {
            if (response.data.code == 0) {
              this.$message({
                type: 'success',
                message: '设置成invalid成功 - ' + response.data.data,
              });
            } else {
              this.$message({
                type: 'error',
                message: '设置成invalid失败：' + response.data.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },

    makeValid(row) {
      this.$confirm('此操作会使此资源处于有效:' + row.title + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          makeValid(row.id).then((response) => {
            if (response.data.code == 0) {
              this.$message({
                type: 'success',
                message: '设置成Valid成功 - ' + response.data.data,
              });
            } else {
              this.$message({
                type: 'error',
                message: '设置成Valid失败：' + response.data.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleSortChange(val) {
      console.log(val);
      if (val != undefined && val != null) {
        if (val.order == 'ascending') {
          this.listQuery.sort = 'asc';
        } else if (val.order == 'descending') {
          this.listQuery.sort = 'desc';
        } else {
          this.listQuery.sort = '';
        }

        this.listQuery.sortBy = val.prop;
        this.getList();
      }
    },

    setOptions() {
      this.statusOptions = [
        {
          value: -1,
          label: '草稿',
        },
        {
          value: 1,
          label: '内容不足',
        },

        {
          value: 2,
          label: '没有链接',
        },

        {
          value: 3,
          label: 'title未修改',
        },
      ];

      this.sourceSiteOptions = [
        { value: 0, label: 'All' },
        {
          value: 'pan666',
          label: 'pan666',
        },
        {
          value: 'wpzys',
          label: 'wpzys',
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
