const indexList = () => {
  const indexList = [];
  const charCodeOfA = 'A'.charCodeAt(0);
  for (let i = 0; i < 26; i++) {
    indexList.push(String.fromCharCode(charCodeOfA + i));
  }
  return [];
};
Component({
  props: {
    height: '100vh',
    // scroll-view必须指定高度
    sticky: true,
    // 是否开启锚点自动吸顶  粘性布局
    zIndex: 100,
    // z-index 层级
    highlightColor: '#07c160',
    // 索引字符高亮颜色
    stickyOffsetTop: 0,
    // 锚点自动吸顶时与顶部的距离
    scrollWithAnimation: true,
    scrollAnimationDuration: 300,
    indexList: indexList() // 索引字符列表	string[] | number[]	  默认值A-Z

  },
  data: {
    activeAnchorIndex: null,
    showSidebar: false,
    children: [],
    scrollTop: 0,
    sidebar: null,
    scrollIntoView: ''
  },

  onInit() {
    this.initHandle();
  },

  didMount() {
    this.$page.components = this.$page.components || {};
    this.$page.components.ready = true;
  },

  methods: {
    async initHandle() {
      this.data.children = [];
      await this.getRectAll('.adc-index-anchor-wrapper').then(rect => {
        rect.forEach(item => {
          if (item) {
            this.data.children.push({
              height: item.height,
              top: item.top
            });
          }
        });
      });
      this.updateData();
    },

    /**
     * 选择所有匹配选择器的节点
     * @param selector
     * @returns {Promise<unknown>}
     */
    getRectAll(selector) {
      return new Promise(resolve => {
        my.createSelectorQuery().selectAll(selector).boundingClientRect().exec((rect = []) => resolve(rect[0]));
      });
    },

    /**
     * 选择当前第一个匹配选择器的节点
     * @param selector
     * @returns {Promise<unknown>}
     */
    getRect(selector) {
      return new Promise(resolve => {
        my.createSelectorQuery().select(selector).boundingClientRect().exec((rect = []) => resolve(rect[0]));
      });
    },

    updateData() {
      this.setData({
        showSidebar: !!this.data.children.length
      });
      this.setRect().then(() => {
        this.onScroll();
      });
    },

    setRect() {
      return Promise.all([this.setSiderbarRect()]);
    },

    setSiderbarRect() {
      return this.getRect('.adc-index-bar__sidebar').then(res => {
        this.data.sidebar = {
          height: res.height,
          top: res.top
        };
      });
    },

    getActiveAnchorIndex() {
      const {
        children,
        scrollTop
      } = this.data;
      const {
        sticky,
        stickyOffsetTop
      } = this.props;

      for (let i = this.data.children.length - 1; i >= 0; i--) {
        const preAnchorHeight = i > 0 ? children[i - 1].height : 0;
        const reachTop = sticky ? preAnchorHeight + stickyOffsetTop : 0;

        if (reachTop + scrollTop >= children[i].top) {
          return i;
        }
      }

      return -1;
    },

    onScroll(e) {
      this.data.scrollTop = e ? e.detail.scrollTop : 0;
      const {
        children = [],
        scrollTop
      } = this.data;

      if (!children.length) {
        return;
      }

      const {
        sticky,
        stickyOffsetTop,
        zIndex,
        highlightColor
      } = this.props;
      const active = this.getActiveAnchorIndex();
      this.setData({
        activeAnchorIndex: active
      });

      if (sticky) {
        let isActiveAnchorSticky = false;

        if (active !== -1) {
          isActiveAnchorSticky = children[active].top <= stickyOffsetTop + scrollTop;
        }

        children.forEach((item, index) => {
          if (index === active) {
            let wrapperStyle = '';
            let anchorStyle = `color: ${highlightColor};`;

            if (isActiveAnchorSticky) {
              wrapperStyle = ` height: ${children[index].height}px;`;
              anchorStyle = `
                                position: fixed;
                                top: ${stickyOffsetTop}px;
                                z-index: ${zIndex};
                                color: ${highlightColor};`;
            }

            this.setDiffData(`anchor${this.props.indexList[index]}`, {
              active: true,
              anchorStyle,
              wrapperStyle
            });
          } else if (index === active - 1) {
            const currentAnchor = children[index];
            const currentOffsetTop = currentAnchor.top;
            const targetOffsetTop = index === children.length - 1 ? this.top : children[index + 1].top;
            const parentOffsetHeight = targetOffsetTop - currentOffsetTop;
            const translateY = parentOffsetHeight - currentAnchor.height;
            const anchorStyle = `
                              position: relative;
                              transform: translate3d(0, ${translateY}px, 0);
                              z-index: ${zIndex};
                              color: ${highlightColor};`;
            this.setDiffData(`anchor${this.props.indexList[index]}`, {
              active: true,
              anchorStyle
            });
          } else {
            this.setDiffData(`anchor${this.props.indexList[index]}`, {
              active: false,
              anchorStyle: '',
              wrapperStyle: ''
            });
          }
        });
      }
    },

    setDiffData(target, data) {
      if (this.$page.components[target]) {
        this.$page.components[target].setData({ ...data
        });
      }
    },

    onClick(event) {
      this.setData({
        scrollIntoView: `adc-index-${event.target.targetDataset.index}`
      });
    },

    onTouchStop() {}

  }
});