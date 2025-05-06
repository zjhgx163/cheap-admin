<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜狗引擎索引提交</span>
        <el-button style="float: right" type="primary" v-loading="loading" @click="sogouIndex"
          >提交</el-button
        >
      </div>
      <div v-for="item in list" :key="item.id" class="text item">
        {{ 'https://www.hjdang.com/d/' + item.id }}
      </div>
    </el-card>

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
import { fetchUnsubmitSogouList, submitIndex } from '@/api/yunpan';
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import {} from '@/api/yunpan';

export default {
  name: 'Yunpan',
  components: { Pagination },

  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
      },

      loading: false,
      multipleSelection: [],
    };
  },

  created() {
    this.getList();
  },
  methods: {
    getList() {
      fetchUnsubmitSogouList(this.listQuery).then((response) => {
        console.log('records = ', response.data.data.records);
        this.list = response.data.data.records;
        this.total = Number(response.data.data.total);
        // this.listQuery.sort = '';
      });
    },

    sogouIndex() {
      this.loading = true;
      let idList = this.list.map((item) => item.id);
      submitIndex(idList).then((response) => {
        if (response.data.code == 0) {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.getList();
          this.loading = false;
        } else {
          this.$message({
            type: 'error',
            message: '提交失败：' + response.data.msg,
          });
          this.loading = false;
        }
      });
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
