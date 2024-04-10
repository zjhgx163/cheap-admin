<template>
  <div class="createPost-container">
    <el-form ref="postForm0" :model="postForm[0]" :rules="rules" class="form-container">
      <el-form ref="postForm1" :model="postForm[1]" :rules="rules" class="form-container">
        <div class="createPost-main-container">
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px" prop="titleGpt">
                <MDinput v-model="postForm[0].titleGpt" :maxlength="100" name="name" required>
                  Title
                </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px" prop="titleGpt">
                <MDinput v-model="postForm[1].titleGpt" :maxlength="100" name="name" required>
                  Title
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="Author:" class="postInfo-container-item">
                    <el-input v-model="postForm[0].auther" disabled style="max-width: 80%" />
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="10">
                <el-form-item style="margin-bottom: 40px" label-width="70px" label="片名:">
                  <el-input v-model="postForm.worksName" placeholder="Please enter the content" />
                </el-form-item>
              </el-col> -->

                <el-col :span="6">
                  <el-form-item class="postInfo-container-item">
                    有效状态：
                    <el-select
                      v-model="validStatusOne"
                      placeholder="请选择"
                      style="max-width: 50%"
                      disabled
                    >
                      <el-option
                        v-for="item in validStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item class="postInfo-container-item">
                    编辑状态：
                    <el-select
                      v-model="postForm[0].editStatus"
                      placeholder="请选择"
                      style="max-width: 50%"
                      disabled
                    >
                      <el-option
                        v-for="item in editStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

            <el-col :span="12">
              <el-row>
                <el-col :span="7">
                  <el-form-item label-width="60px" label="Author:" class="postInfo-container-item">
                    <el-input v-model="postForm[1].auther" disabled style="max-width: 80%" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item class="postInfo-container-item" prop="validStatusTwo">
                    有效状态：
                    <el-select
                      v-model="validStatusTwo"
                      placeholder="请选择"
                      style="max-width: 50%"
                      disabled
                    >
                      <el-option
                        v-for="item in validStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item class="postInfo-container-item">
                    编辑状态：
                    <el-select
                      v-model="postForm[1].editStatus"
                      placeholder="请选择"
                      style="max-width: 50%"
                      disabled
                    >
                      <el-option
                        v-for="item in editStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item prop="contentGpt" style="margin-bottom: 30px">
                <Tinymce
                  ref="editor"
                  v-model="postForm[0].contentGpt"
                  :height="400"
                /> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item prop="contentGpt" style="margin-bottom: 30px">
                <Tinymce
                  ref="editor"
                  v-model="postForm[1].contentGpt"
                  :height="400"
                /> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :span="12">
              <el-row>
                <el-col :span="8">
                  <el-button
                    v-loading="loading"
                    size="small"
                    style="margin-left: 10px"
                    type="success"
                    @click="submitForm(postForm[0], 'postForm0')"
                  >
                    Publish
                  </el-button>
                </el-col>
                <el-col :span="8">
                  <el-button
                    size="small"
                    style="margin-left: 10px"
                    type="danger"
                    @click="del(postForm[0])"
                  >
                    Delete
                  </el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="8">
                  <el-button
                    v-loading="loading"
                    size="small"
                    style="margin-left: 10px"
                    type="success"
                    @click="submitForm(postForm[1], 'postForm1')"
                  >
                    Publish
                  </el-button></el-col
                >
                <el-button
                  size="small"
                  style="margin-left: 10px"
                  type="danger"
                  @click="del(postForm[1])"
                >
                  Delete
                </el-button>
              </el-row>
            </el-col>
          </el-row>

          <!-- <el-form-item prop="image_uri" style="margin-bottom: 30px">
          <Upload v-model="postForm.image_uri" />
        </el-form-item> -->
        </div>
      </el-form>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
// import Upload from '@/components/Upload/SingleImage3';
import MDinput from '@/components/MDinput';
// import { validURL } from '@/utils/validate';
import { submitArticle } from '@/api/article';
import { searchUser } from '@/api/remote-search';
import Sticky from '@/components/Sticky'; // 粘性header组件
import { RadioButtonDropDown, KeywordDropdown } from '../manage/components/Dropdown';

import { getCompareYunpanItems, deleteYunpanItem } from '@/api/yunpan';

const defaultForm = [
  {
    platform: 1,
    auther: null,
    title: '',
    content: '',
    keywords: '', // 关键词
    image_uri: '', // 文章图片
    // display_time: undefined, // 前台展示时间
    id: undefined,
  },
  {
    platform: 1,
    auther: null,
    title: '',
    content: '',
    keywords: '', // 关键词
    image_uri: '', // 文章图片
    // display_time: undefined, // 前台展示时间
    id: undefined,
  },
];

export default {
  name: 'ArticleEditor',
  components: {
    Tinymce,
    MDinput,
  },
  props: {
    validStatusOne: {
      type: Number,
    },
    editStatusOne: {
      type: Number,
    },
    validStatusTwo: {
      type: Number,
    },
    editStatusTwo: {
      type: Number,
    },
    compareId: {
      type: String,
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
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        titleGpt: [{ validator: validateRequire }],
        contentGpt: [{ validator: validateRequire }],
      },
      tempRoute: {},
      validStatusOptions: [],
      editStatusOptions: [],
    };
  },
  computed: {
    lang() {
      return this.$store.getters.language;
    },

    // displayTime: {
    //   // set and get is useful when the data
    //   // returned by the back end api is different from the front end
    //   // back end return => "2013-06-25 06:59:25"
    //   // front end need timestamp => 1372114765000
    //   get() {
    //     return +new Date(this.postForm.display_time);
    //   },
    //   set(val) {
    //     this.postForm.display_time = new Date(val);
    //   },
    // },
  },
  created() {
    this.setOptions(); // set default select options
    console.log('created');
    const id = this.$route.params && this.$route.params.id;
    console.log('this.compareId', this.compareId);

    this.fetchData([
      { id: id, validStatus: this.validStatusOne },
      { id: this.compareId, validStatus: this.validStatusTwo },
    ]);

    // if (this.isEdit) {
    // } else {
    //   this.getRandomUserList();
    // }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    fetchData(query) {
      getCompareYunpanItems(query)
        .then((response) => {
          if (response.data.code == 0) {
            // autherMixId==0时展示autherName

            this.postForm = response.data.data;
            this.postForm[0].platform = 1;
            this.postForm[1].platform = 1;

            this.postForm[0].validStatus = this.validStatusOne;
            this.postForm[1].validStatus = this.validStatusTwo;

            // set tagsview title
            this.setTagsViewTitle();

            // set page title
            this.setPageTitle();
          } else {
            this.$notify({
              title: '获取文章信息失败',
              type: 'error',
              message: '获取文章信息失败：' + query.id,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article';
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm[0].id}-${this.postForm[1].id}`,
      });
      this.$store.dispatch('tagsView/updateVisitedView', route);
    },
    setPageTitle() {
      const title = 'Edit Article';
      document.title = `${title} - ${this.postForm[0].id} -  ${this.postForm[1].id}}`;
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
              setTimeout(() => {
                this.$router.push({
                  path: '/yunpan',
                });
              }, 500);
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
    submitForm(form, index) {
      console.log(index);

      this.$refs[index].validate((valid) => {
        if (valid) {
          this.loading = true;
          submitArticle(form).then((response) => {
            if (response.data.code == 0) {
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000,
              });
              form.editStatus = 3;
              //   setTimeout(() => {
              //     this.$router.push({
              //       path: '/yunpan',
              //       query: { validStatus: this.validStatus, editStatus: this.editStatus },
              //     });
              //   }, 500);
            } else {
              this.$notify({
                title: '失败',
                type: 'error',
                message: '发布失败：' + response.data.msg,
              });
            }
            this.loading = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    setOptions() {
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
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
