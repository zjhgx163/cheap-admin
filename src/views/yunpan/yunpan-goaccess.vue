<template>
  <div>
    <el-row :gutter="1" style="margin: 40px 15px 40px">
      <el-col :span="4" :xs="24">
        <div class="block">
          日期：
          <el-date-picker
            v-model="listQuery.queryDate"
            :placeholder="$t('order.datePlaceholder')"
            type="date"
            style="max-width: 70%"
          />
        </div>
      </el-col>
      <el-col :span="3" :xs="24">
        <div class="block">
          ID：
          <el-input v-model="listQuery.id" placeholder="ID" style="max-width: 80%" />
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

      <el-col :span="3" :xs="24">
        <div class="block">
          有效状态：
          <el-select
            v-model="listQuery.validStatus"
            placeholder="请选择"
            clearable
            style="max-width: 50%"
          >
            <el-option
              v-for="item in validStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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

      <el-table-column width="170" align="center" label="URL" prop="url">
        <template slot-scope="scope">
          <a :href="'https://www.hjdang.com' + scope.row.url" class="link-type">
            {{ scope.row.url }}</a
          >
        </template>
      </el-table-column>

      <el-table-column width="160" align="center" label="ID" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="访问人数" sortable="custom" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.visitors }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击数" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.hits }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题" width="170">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top-start">
            <a :href="'https://www.hjdang.com' + scope.row.url" class="link-type">
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

      <el-table-column align="center" label="作品名" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.worksName }}</span>
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

      <el-table-column align="center" label="来源网站" width="90" prop="sourceSite">
        <template slot-scope="scope">
          {{ scope.row.source }}
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

      <el-table-column width="140" align="center" label="请求时间" prop="requestDate">
        <template slot-scope="scope">
          <span>{{ scope.row.requestDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.tag }}</span>
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
import { fetchGoaccessPageList } from '@/api/yunpan';
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination

export default {
  name: 'YunpanGoaccesPage',
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
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 50,
        validStatus: '',
        editStatus: '',
        queryDate: null,
        id: '',
        keyword: '',
        workName: '',
      },
      editStatusOptions: [
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
      ],
      validStatusOptions: [
        {
          value: -1,
          label: '失效',
        },
        {
          value: 1,
          label: '有效',
        },
      ],

      loading: false,
      multipleSelection: [],
    };
  },
  props: {
    editStatus: {
      type: Number,
      default: null,
    },
    validStatus: {
      type: Number,
    },
  },
  created() {
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
      fetchGoaccessPageList(this.listQuery).then((response) => {
        console.log('records = ', response.data.data.records);
        this.list = response.data.data.records;
        this.total = Number(response.data.data.total);
        this.listLoading = false;
        // this.listQuery.sort = '';
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
