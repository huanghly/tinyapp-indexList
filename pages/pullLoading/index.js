// mock列表数据
const mockData = [{
  title: '列表1',
  remarksa: '备注1',
  remarksb: '备注2'
}, {
  title: '列表2',
  remarksa: '备注1',
  remarksb: '备注2'
}, {
  title: '列表3',
  remarksa: '备注1',
  remarksb: '备注2'
}, {
  title: '列表4',
  remarksa: '备注1',
  remarksb: '备注2'
}, {
  title: '列表5',
  remarksa: '备注1',
  remarksb: '备注2'
}, {
  title: '列表6',
  remarksa: '备注1',
  remarksb: '备注2'
}];
// mock列表总数
const mockTotal = 60;
Page({
  data: {
    show: false, // 是否显示加载动画
    page: 1, // 当前页数
    list: [] // 页面List数据
  },
  onLoad() {
    this.mySchedulde();
  },
  /**
   * scroll-view滑到底部触发事件
   * @method scrollMytrip
   */
  async scrollMytrip() {
    try {
      const { page, list, } = this.data;
      // 判断是否还有数据需要加载
      if (list.length < mockTotal) {
        this.setData({ show: true });
        const newPage = page + 1;
        this.mySchedulde(newPage);
      }
    } catch (e) {
      this.setData({ show: false });
      console.log('scrollMytrip执行异常:', e);
    }
  },
  /**
   * 模拟请求服务端查询数据并渲染页面
   * @method mySchedulde
   * @param {int} page 分页,默认第1页
   */
  async mySchedulde(page = 1) {
    try {
      let list = this.data.list;
      // 模拟请求拿到数据进行更新data
      setTimeout(() => {
        let data = mockData;
        for (let i = 0; i < data.length; i++) {
          let newObj = { ...data[i], remarksa: `我是第${page}页` };
          list.push(newObj);
        }
        this.setData({
          list,
          page,
          show: false
        });
      }, 1000);
    } catch (e) {
      console.log('mySchedulde执行异常:', e);
    }
  }
});