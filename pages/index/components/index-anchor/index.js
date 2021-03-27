Component({
  props: {
    useSlot: false,
    index: null
  },
  data: {
    active: false,
    wrapperStyle: '',
    anchorStyle: ''
  },

  didMount() {
    this.$page.components = this.$page.components || {};
    this.$page.components[`anchor${this.props.index}`] = this.$page.components[`anchor${this.props.index}`] || this;
  },

  deriveDataFromProps(next) {
    if (!next) return false;

    if (next.index !== this.props.index) {
      if (this.$page.components.ready) {
        this.$page.components = {
          ready: false
        };
      }

      this.$page.components[`anchor${next.index}`] = this.$page.components[`anchor${next.index}`] || this;
    }
  },

  methods: {}
});