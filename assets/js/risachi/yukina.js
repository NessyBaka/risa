/*eslint no-undef: 0*/
const DATA_URL = "./meta.json";

new Vue({
  el: "body > div:first-child",
  name: "Risa",
  data: {
    window: {
      width: 0,
      height: 0
    },

    list: {
      data: null,
      show: null,
      query: null,
      error: null,
      fuse: {
        base: null,
        options: {
          shouldSort: true,
          threshold: 0.3,
          keys: [
            { name: "name", weight: 0.5 },
            { name: "author", weight: 0.3 },
            { name: "index", weight: 0.2 }
          ]
        }
      },
      selected: null
    },
    menu: {
      opened: false,
      theme: null
    },
    themes: ["milk-light", "cute-brown", "deep-dark"]
  },
  computed: {
    compact() {
      return this.window.width <= 700;
    },
    iconMenuSwitcher() {
      return [this.menu.opened ? "fa-caret-square-up" : "fa-paint-brush"];
    }
  },
  /* Events */
  created() {
    this.list.selected = document.location.hash.slice(
      1,
      document.location.hash.length
    );
    this.fetchData(DATA_URL);
    window.addEventListener("resize", this.$_onResize);
    this.$_onResize();
  },
  mounted() {
    this.theme();
  },
  destroyed() {
    window.removeEventListener("resize", this.$_onResize);
  },
  /* Non-Reactive Properties */
  methods: {
    $_onResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },

    fetchData(source) {
      fetch(source)
        .then(result => {
          if (result.ok) return result.json();
          else throw new Error(result.statusText);
        })
        .then(this.processData)
        .catch(error => {
          this.list.error = error;
        });
    },
    processData(data) {
      this.list.data = data.skins;
      this.list.show = this.list.data;
      this.list.fuse.base = new Fuse(this.list.data, this.list.fuse.options);
    },
    searchForData() {
      if (this.list.query)
        this.list.show = this.list.fuse.base.search(this.list.query);
      else this.list.show = this.list.data;
    },
    selectSkin(ID) {
      if (!ID) return;

      if (ID === this.list.selected) this.list.selected = null;
      else this.list.selected = ID;
    },
    theme(theme_name) {
      if (!theme_name) theme_name = this.$cookies.get("theme");
      if (this.$cookies.get("theme") !== theme_name)
        this.$cookies.set("theme", theme_name);
      this.$el.ownerDocument.documentElement.className = this.menu.theme = theme_name;
    }
  }
});
