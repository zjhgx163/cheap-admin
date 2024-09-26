<template>
  <div>
    <el-row :gutter="1" style="margin: 40px 15px 40px">
      <el-col :span="4" :xs="24">
        <div class="block">
          搜索引擎：
          <el-select
            v-model="listQuery.searchEngineCrawled"
            clearable
            placeholder="请选择"
            style="max-width: 50%"
          >
            <el-option
              v-for="item in searchEngineOptions"
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
          爬取/自有：
          <el-select
            v-model="listQuery.source"
            clearable
            placeholder="请选择"
            style="max-width: 50%"
          >
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>

      <el-col :span="4" :xs="24">
        <div class="block">
          编辑状态：
          <el-select
            v-model="listQuery.editStatus"
            clearable
            placeholder="请选择"
            style="max-width: 60%"
          >
            <el-option
              v-for="item in editStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>

      <el-col :span="4" :xs="24">
        <div class="block">
          有效状态：
          <el-select v-model="listQuery.validStatus" placeholder="请选择" style="max-width: 40%">
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
      <el-col :span="4" :xs="24">
        <div class="block">
          ID：
          <el-input v-model="listQuery.id" placeholder="ID" style="max-width: 80%" />
        </div>
      </el-col>

      <el-col :span="5" :xs="24">
        <div class="block">
          标题：
          <el-input v-model="listQuery.title" placeholder="搜索关键字" style="max-width: 80%" />
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
          作品名:
          <el-input v-model="listQuery.workName" placeholder="作品名" style="max-width: 70%" />
        </div>
      </el-col>

      <el-col :span="1" :xs="24">
        <div class="block">
          <el-button type="primary" @click.prevent.stop="getList"> 查询 </el-button>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="1" style="margin: 40px 15px 40px" align="top" type="flex">
      <el-col :span="3" :xs="24">
        <div class="block">
          请选中两条
          <el-button
            type="primary"
            @click.prevent.stop="compare"
            icon="el-icon-s-check"
            size="small"
          >
            比对
          </el-button>
        </div>
      </el-col>
      <el-col :span="5" :xs="24">
        <div>
          <el-input
            label="替换"
            type="textarea"
            v-model="myLinks"
            placeholder="替换链接"
            style="width: 300px; max-width: 100%"
          />
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
    >
      <el-table-column type="selection" width="40"> </el-table-column>

      <el-table-column width="170" align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140" align="center" label="最后更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.lastUpdateDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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

      <el-table-column align="center" label="有效状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.validStatus | validStatusFilter" size="mini" effect="dark">
            {{ scope.row.validStatus | parseValidStatus }}
          </el-tag>
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
                    validStatus: row.validStatus,
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
                    query: { validStatus: row.validStatus, editStatus: row.editStatus },
                  })
                "
              >
                对比
              </el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column align="center" label="作品名" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.worksName }}</span>
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

      <el-table-column align="center" label="来源" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.tag }}</span>
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
import { fetchSpiderPageList } from '@/api/yunpan';
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
    //上面的parseTime也是filter
    validStatusFilter(status) {
      const statusMap = {
        1: 'success',
        '-1': 'info',
      };
      return statusMap[status];
    },
    parseValidStatus(status) {
      const statusMap = {
        1: '有效',
        '-1': '失效',
      };
      return statusMap[status];
    },
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error',
        });
        callback(new Error(rule.field + '为必传项'));
      } else {
        callback();
      }
    };
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        source: 0,
        validStatus: 1,
        editStatus: '',
        searchEngineCrawled: 0,
        dateRange: null,
        id: '',
        keyword: '',
        workName: '',
        title: '',
        yunpanLink: '',
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
      postForm: {
        ids: '',
        validStatus: 1,
      },
      rules: {
        // image_uri: [{ validator: validateRequire }],
        ids: [{ validator: validateRequire }],
        validStatus: [{ validator: validateRequire }],
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }],
      },
      loading: false,
      multipleSelection: [],
      myLinks: '',
      replaceLinksLoading: false,
      baiduStaticsHandlerURL: process.env.VUE_APP_BASE_API2 + '/admin/baidustatics/upload',
      fileList: [],
    };
  },
  props: {
    editStatus: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
    },
    validStatus: {
      type: Number,
    },
  },
  created() {
    this.setOptions(); // set default select options
    if (this.editStatus != null && !isNaN(this.editStatus)) {
      this.listQuery.editStatus = this.editStatus;
    }
    if (this.validStatus != null && !isNaN(this.validStatus)) {
      this.listQuery.validStatus = this.validStatus;
    }
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchSpiderPageList(this.listQuery).then((response) => {
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
    move(row) {
      this.$confirm('此操作会改变此云盘资源:' + row.title + '的id, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          moveYunpanItem(row.id, row.validStatus).then((response) => {
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
          removeYunpanItem(row.id, row.validStatus).then((response) => {
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
          deleteYunpanItem(row.id, row.validStatus).then((response) => {
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

    compare() {
      if (this.multipleSelection.length != 2) {
        this.$message({
          type: 'error',
          message: `请选中两条记录`,
        });
        return;
      }
      this.$router.push({
        path: '/yunpan/compare/' + this.multipleSelection[0].id,
        query: {
          validStatusOne: this.multipleSelection[0].validStatus,
          editStatusOne: this.multipleSelection[0].editStatus,
          validStatusTwo: this.multipleSelection[1].validStatus,
          editStatusTwo: this.multipleSelection[1].editStatus,
          compareId: this.multipleSelection[1].id,
        },
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
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
        {
          value: -1,
          label: 'gpt编辑失败',
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
          label: 'sogou',
        },
        {
          value: 3,
          label: '神马',
        },
        {
          value: 4,
          label: 'google',
        },
        {
          value: 5,
          label: 'bing',
        },
        {
          value: 6,
          label: 'yandex',
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
