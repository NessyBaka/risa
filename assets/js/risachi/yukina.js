/*eslint no-undef: 0*/
const DATA_URL =
  "https://gist.githubusercontent.com/aneyo/c92396022314311bd7fe6556b01fb630/raw/data.json"; // New data file scheme

new Vue({
  el: "body > div:first-child",
  name: "Risa",
  data: {
    window: {
      width: 0,
      height: 0,
    },

    listing: {
      data: null, // Skin list
      updated: null, // Last time list was updated
      show: null,
      query: null,
      error: null,
      fuse: {
        base: null,
        options: {
          shouldSort: true,
          threshold: 0.3,
          keys: [
            { name: "names", weight: 0.5 },
            { name: "author.name", weight: 0.3 },
            { name: "tags", weight: 0.2 },
          ],
        },
      },
      selected: null,
    },
    menu: {
      opened: false,
      theme: null,
      birthday: {
        menu: false,
        first: true,
      },
    },
    themes: ["milk-light", "cute-brown", "deep-dark", "wine-birthday"],
  },
  computed: {
    isBirthdayToday() {
      // shouldn't use computed for this but i dont really care
      const date = new Date();
      if (date.getMonth() !== 7) return false;
      const day = date.getDate();
      return day === 25 || day === 28;
    },
    yearsSinceCreation() {
      return new Date().getFullYear() - 2018;
    },
    yearsSinceCreationSuffix() {
      switch (this.yearsSinceCreation) {
        case 0:
          return "(?)";
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
      }
      return "th";
    },
    iconMenuSwitcher() {
      return [
        this.menu.opened
          ? "fa-window-close"
          : this.isBirthdayToday
          ? "fa-birthday-cake"
          : "fa-paint-brush",
        this.menu.birthday.first ? "w" : "",
      ];
    },
    searchPlaceholderText() {
      return this.isBirthdayToday
        ? `Happy ${
            this.yearsSinceCreation + this.yearsSinceCreationSuffix
          } birthday!`
        : "リサ";
    },
  },
  /* Events */
  created() {
    this.listing.selected = document.location.hash.slice(
      1,
      document.location.hash.length
    );
    this.fetchData(DATA_URL);
  },
  mounted() {
    this.menu.birthday.first = !(this.$cookies.get("birthday") === "true");
    this.theme();
  },
  /* Non-Reactive Properties */
  methods: {
    fetchData(source) {
      fetch(source)
        .then((result) => {
          if (result.ok) return result.json();
          else throw new Error(result.statusText);
        })
        .then(this.processData)
        .catch((error) => {
          this.listing.error = error;
        });
    },
    processData(data) {
      this.listing.updated = new Date(data.updated);
      this.listing.data = data.listing.filter(this.skinFilter);
      this.listing.show = this.listing.data;
      this.listing.fuse.base = new Fuse(
        this.listing.data,
        this.listing.fuse.options
      );
    },
    skinFilter(skin) {
      return skin.id || !skin.hide; // Filter for hidden skins
    },
    searchForData() {
      if (this.listing.query)
        this.listing.show = this.listing.fuse.base.search(this.listing.query);
      else this.listing.show = this.listing.data;
    },
    selectSkin(ID) {
      if (!ID) return;

      if (ID === this.listing.selected) this.listing.selected = null;
      else this.listing.selected = ID;
    },
    theme(theme_name) {
      if (!theme_name) theme_name = this.$cookies.get("theme");
      if (this.$cookies.get("theme") !== theme_name)
        this.$cookies.set("theme", theme_name);
      this.$el.ownerDocument.documentElement.className = this.menu.theme =
        theme_name;
    },
    openMenu() {
      this.menu.opened = !this.menu.opened;
      /* --- */
      this.menu.birthday.first = false;
      this.$cookies.set("birthday", "true");
    },
  },
});
