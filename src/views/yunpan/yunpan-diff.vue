<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <RadioButtonDropDown
          v-model="postForm.isCollection"
          :labels="[
            { value: 1, text: true },
            { value: 0, text: false },
          ]"
          title="Is Collections Resource: "
        />
        <RadioButtonDropDown
          v-model="postForm.isBest"
          :labels="[
            { value: 1, text: true },
            { value: 0, text: false },
          ]"
          title="Is Best Article: "
        />

        <KeywordDropdown v-model="postForm.keywords" />
        <el-button v-loading="loading" style="margin-left: 10px" type="success" @click="submitForm">
          Publish
        </el-button>
        <!-- <el-button v-loading="loading" type="warning" @click="draftForm" :disabled="isEdit">
          Draft
        </el-button> -->
      </sticky>
      <div class="createPost-main-container">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required disabled>
                Title
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="margin-bottom: 40px" prop="titleGpt">
              <MDinput v-model="postForm.titleGpt" :maxlength="100" name="name" required>
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
                  <el-select
                    disabled
                    v-model="autherName"
                    :remote-method="searchUser"
                    filterable
                    default-first-option
                    remote
                    clearable
                    :placeholder="autherName"
                  >
                    <el-option
                      style="margin-bottom: 5px"
                      v-for="(item, index) in userListOptions"
                      :key="item.id + index"
                      :label="item.name"
                      :value="item.id"
                    >
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        <el-avatar :src="item.avatar" size="small"></el-avatar
                      ></span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- <el-col :span="10">
                <el-form-item style="margin-bottom: 40px" label-width="70px" label="片名:">
                  <el-input v-model="postForm.worksName" placeholder="Please enter the content" />
                </el-form-item>
              </el-col> -->

              <el-col :span="8">
                <el-form-item label-width="90px" label="标签:" class="postInfo-container-item">
                  <el-select
                    v-model="postForm.tag"
                    default-first-option
                    placeholder="标签"
                    disabled
                  >
                    <el-option
                      v-for="item in tagOptions"
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
              <el-col :span="8">
                <el-form-item label-width="60px" label="Author:" class="postInfo-container-item">
                  <el-select
                    :disabled="isEdit"
                    v-model="postForm.autherMixId"
                    :remote-method="searchUser"
                    filterable
                    default-first-option
                    remote
                    clearable
                    :placeholder="autherName"
                  >
                    <el-option
                      style="margin-bottom: 5px"
                      v-for="(item, index) in userListOptions"
                      :key="item.id + index"
                      :label="item.name"
                      :value="item.id"
                    >
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        <el-avatar :src="item.avatar" size="small"></el-avatar
                      ></span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item style="margin-bottom: 40px" label-width="70px" label="片名:">
                  <el-input v-model="postForm.worksName" placeholder="Please enter the content" />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item
                  label-width="90px"
                  label="标签:"
                  class="postInfo-container-item"
                  prop="tag"
                >
                  <el-select
                    v-model="postForm.tag"
                    default-first-option
                    placeholder="标签"
                    :disabled="isEdit"
                  >
                    <el-option
                      v-for="item in tagOptions"
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
              <Tinymce ref="editor" v-model="postForm.content" :height="400" /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item prop="contentGpt" style="margin-bottom: 30px">
              <Tinymce ref="editor" v-model="postForm.contentGpt" :height="400" /> </el-form-item
          ></el-col>
        </el-row>
        <el-button type="text" size="mini" icon="el-icon-edit"> 显示回复 </el-button>

        <!-- <el-form-item prop="image_uri" style="margin-bottom: 30px">
          <Upload v-model="postForm.image_uri" />
        </el-form-item> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
// import Upload from '@/components/Upload/SingleImage3';
import MDinput from '@/components/MDinput';
// import { validURL } from '@/utils/validate';
import { getArticle, submitArticle } from '@/api/article';
import { searchUser } from '@/api/remote-search';
import Sticky from '@/components/Sticky'; // 粘性header组件
import { RadioButtonDropDown, KeywordDropdown } from '../manage/components/Dropdown';

import { fetchRandomAutherList, fetchAuthorInfo } from '@/api/yunpan';

const defaultForm = {
  status: 'published',
  autherMixId: null,
  platform: 1,
  auther: null,
  tag: '',
  title: '',
  titleGpt: '', // 文章题目
  content: '',
  contentGpt: '', // 文章内容
  worksName: '', // 文章摘要
  keywords: '', // 关键词
  image_uri: '', // 文章图片
  // display_time: undefined, // 前台展示时间
  id: undefined,
  isBest: false,
  isCollection: false,
  validStatus: 0,
  // importance: 0,
};

export default {
  name: 'ArticleEditor',
  components: {
    Tinymce,
    MDinput,
    Sticky,
    RadioButtonDropDown,
    KeywordDropdown,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },

    validStatus: {
      type: Number,
    },
    editStatus: {
      type: Number,
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
      userListOptions: [],
      rules: {
        // image_uri: [{ validator: validateRequire }],
        titleGpt: [{ validator: validateRequire }],
        contentGpt: [{ validator: validateRequire }],
        tag: [{ validator: validateRequire }],
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }],
      },
      tempRoute: {},
      tagOptions: [],
      autherName: '',
      listLoading: false,
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.workesName.length;
    },
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

    this.fetchData({ id: id, type: 'yunpan', validStatus: this.validStatus });

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
      getArticle(query)
        .then((response) => {
          if (response.data.code == 0) {
            // autherMixId==0时展示autherName
            if (response.data.data.autherMixId == 0) {
              response.data.data.autherMixId = null;
            }
            this.postForm = response.data.data;
            if (response.data.data.autherMixId != null && response.data.data.autherMixId > 0) {
              this.getAutherInfo(response.data.data.autherMixId);
            }
            this.autherName = response.data.data.auther;
            this.postForm.platform = 1;

            this.postForm.validStatus = this.validStatus;

            // just for test
            // this.postForm.title += `   Article Id:${this.postForm.id}`;
            // this.postForm.workesName += `   Article Id:${this.postForm.id}`;

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
        title: `${title}-${this.postForm.id}-${this.postForm.editStatus}`,
      });
      this.$store.dispatch('tagsView/updateVisitedView', route);
    },
    setPageTitle() {
      const title = 'Edit Article';
      document.title = `${title} - ${this.postForm.id}`;
    },
    submitForm() {
      console.log(this.postForm);

      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          submitArticle(this.postForm).then((response) => {
            if (response.data.code == 0) {
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000,
              });
              setTimeout(() => {
                this.$router.push({
                  path: '/yunpan',
                  query: { validStatus: this.validStatus, editStatus: this.editStatus },
                });
              }, 500);
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
      this.tagOptions = [
        {
          value: '影视',
          label: '影视',
        },
        {
          value: '动漫',
          label: '动漫',
        },
        {
          value: '学习',
          label: '学习',
        },
        {
          value: '音乐/音频',
          label: '音乐/音频',
        },
        {
          value: '游戏/软件',
          label: '游戏/软件',
        },
        {
          value: '书籍',
          label: '书籍',
        },
        {
          value: '图片',
          label: '图片',
        },
        {
          value: '求资源',
          label: '求资源',
        },
        {
          value: '其他',
          label: '其他',
        },
      ];
    },

    getRandomUserList() {
      fetchRandomAutherList().then((response) => {
        if (!response.data.data) return;
        this.userListOptions = response.data.data;
      });
    },
    getAutherInfo(id) {
      fetchAuthorInfo(id).then((response) => {
        this.userListOptions.push(response.data.data);
        this.postForm.autherMixId = response.data.data.id;
      });
    },
    searchUser(query) {
      searchUser(query).then((response) => {
        if (!response.data.items) return;
        this.userListOptions = response.data.items.map((v) => v.name);
      });
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
