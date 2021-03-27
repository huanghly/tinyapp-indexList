
Page({
  data: {
    list: [],
    indexList: [],

  },
  onLoad() {
    this.getIndexList();
  },
  getIndexList() {
    const indexList = [];
    const listData = [];
    const charCodeOfA = 'A'.charCodeAt(0);
    for (let i = 0; i < 26; i++) {
      const title = String.fromCharCode(charCodeOfA + i);
      indexList.push(title);
      const arr = [];
      for (let a = 0; a < 12; a++) {
        arr.push(title + a);
      }
      listData.push({
        title,
        arr
      });
    }
    this.setData({
      list: listData,
      indexList
    });
  },
  onClick(event) {
    this.setData({
      scrollIntoView: `adc-index-${event.target.targetDataset.index}`
    });
  },
});